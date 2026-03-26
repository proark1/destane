import { NextRequest, NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let result;
    if (status && search) {
      result = await query(
        "SELECT * FROM productions WHERE status = $1 AND (title ILIKE $2 OR genre ILIKE $2) ORDER BY created_at DESC",
        [status, `%${search}%`]
      );
    } else if (status) {
      result = await query("SELECT * FROM productions WHERE status = $1 ORDER BY created_at DESC", [status]);
    } else if (search) {
      result = await query(
        "SELECT * FROM productions WHERE (title ILIKE $1 OR genre ILIKE $1) ORDER BY created_at DESC",
        [`%${search}%`]
      );
    } else {
      result = await query("SELECT * FROM productions ORDER BY created_at DESC");
    }
    return NextResponse.json({ productions: result.rows });
  } catch (err) {
    console.error("Productions GET error:", err);
    return NextResponse.json({ error: "Failed to fetch productions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, genre, description, director, starring, budget, funding_goal, token_price, min_investment, projected_roi, image_url, release_date, revenue_share_pct } = body;

    if (!title || !funding_goal) {
      return NextResponse.json({ error: "Title and funding goal are required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO productions (title, genre, description, director, starring, budget, funding_goal, token_price, min_investment, projected_roi, image_url, release_date, revenue_share_pct, created_by, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'pending') RETURNING *`,
      [title, genre || null, description || null, director || null, starring || null, budget || 0, funding_goal, token_price || 1, min_investment || 100, projected_roi || 0, image_url || null, release_date || null, revenue_share_pct || 15, user.id]
    );

    await query("INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)", [user.id, "production", `Submitted new production: ${title}`]);

    return NextResponse.json({ production: result.rows[0] });
  } catch (err) {
    console.error("Productions POST error:", err);
    return NextResponse.json({ error: "Failed to create production" }, { status: 500 });
  }
}
