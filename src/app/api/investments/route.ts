import { NextRequest, NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await query(
      `SELECT i.*, p.title, p.genre, p.status as production_status, p.projected_roi, p.image_url, p.director
       FROM investments i
       JOIN productions p ON i.production_id = p.id
       WHERE i.user_id = $1
       ORDER BY i.invested_at DESC`,
      [user.id]
    );

    return NextResponse.json({ investments: result.rows });
  } catch (err) {
    console.error("Investments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { production_id, amount } = await request.json();

    if (!production_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Valid production and amount required" }, { status: 400 });
    }

    // Get production details
    const prod = await query("SELECT * FROM productions WHERE id = $1 AND status = 'funding'", [production_id]);
    if (prod.rows.length === 0) {
      return NextResponse.json({ error: "Production not found or not accepting investments" }, { status: 404 });
    }

    const production = prod.rows[0];
    if (amount < parseFloat(production.min_investment)) {
      return NextResponse.json({ error: `Minimum investment is $${production.min_investment}` }, { status: 400 });
    }

    const remaining = parseFloat(production.funding_goal) - parseFloat(production.funding_raised);
    if (amount > remaining) {
      return NextResponse.json({ error: `Maximum remaining investment is $${remaining.toFixed(2)}` }, { status: 400 });
    }

    const tokens = Math.floor(amount / parseFloat(production.token_price));
    const equity = (amount / parseFloat(production.funding_goal)) * 100;

    // Atomically update funding — prevents over-subscription under concurrency
    const fundingUpdate = await query(
      "UPDATE productions SET funding_raised = funding_raised + $1 WHERE id = $2 AND status = 'funding' AND funding_raised + $1 <= funding_goal RETURNING *",
      [amount, production_id]
    );
    if (fundingUpdate.rows.length === 0) {
      return NextResponse.json({ error: "Investment exceeds remaining funding capacity. Please try a smaller amount." }, { status: 400 });
    }

    // Create investment record
    const inv = await query(
      "INSERT INTO investments (user_id, production_id, amount, tokens, equity_pct) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [user.id, production_id, amount, tokens, equity]
    );

    // Atomically transition to 'production' if fully funded
    await query(
      "UPDATE productions SET status = 'production' WHERE id = $1 AND funding_raised >= funding_goal AND status = 'funding'",
      [production_id]
    );

    // Log activity
    await query("INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)", [user.id, "investment", `Invested $${amount} in ${production.title}`]);

    return NextResponse.json({ investment: inv.rows[0] });
  } catch (err) {
    console.error("Investment POST error:", err);
    return NextResponse.json({ error: "Failed to process investment" }, { status: 500 });
  }
}
