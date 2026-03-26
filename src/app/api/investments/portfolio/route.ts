import { NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const stats = await query(
      `SELECT
        COALESCE(SUM(i.amount), 0) as total_invested,
        COUNT(i.id) as total_positions,
        COUNT(DISTINCT i.production_id) as unique_productions
       FROM investments i WHERE i.user_id = $1`,
      [user.id]
    );

    const row = stats.rows[0];
    const totalInvested = parseFloat(row.total_invested);
    // Estimate portfolio value with a growth multiplier based on avg projected ROI
    const roiResult = await query(
      `SELECT COALESCE(AVG(p.projected_roi), 0) as avg_roi
       FROM investments i JOIN productions p ON i.production_id = p.id
       WHERE i.user_id = $1`,
      [user.id]
    );
    const avgRoi = parseFloat(roiResult.rows[0].avg_roi);
    const portfolioValue = totalInvested * (1 + avgRoi / 100);
    const projectedEarnings = totalInvested * (avgRoi / 100) * 3; // 3-year projection

    return NextResponse.json({
      total_invested: totalInvested,
      portfolio_value: portfolioValue,
      projected_earnings: projectedEarnings,
      total_positions: parseInt(row.total_positions),
      unique_productions: parseInt(row.unique_productions),
    });
  } catch (err) {
    console.error("Portfolio GET error:", err);
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
