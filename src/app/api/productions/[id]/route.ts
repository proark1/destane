import { NextRequest, NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await initDb();
    const { id } = await params;
    const result = await query("SELECT * FROM productions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Production not found" }, { status: 404 });
    }

    const investorCount = await query("SELECT COUNT(DISTINCT user_id) as count FROM investments WHERE production_id = $1", [id]);

    return NextResponse.json({
      production: result.rows[0],
      investor_count: parseInt(investorCount.rows[0].count),
    });
  } catch (err) {
    console.error("Production GET error:", err);
    return NextResponse.json({ error: "Failed to fetch production" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (status) {
      await query("UPDATE productions SET status = $1 WHERE id = $2", [status, id]);
      await query("INSERT INTO activity_log (user_id, type, message) VALUES ($1, $2, $3)", [user.id, "admin", `Updated production #${id} status to ${status}`]);
    }

    const result = await query("SELECT * FROM productions WHERE id = $1", [id]);
    return NextResponse.json({ production: result.rows[0] });
  } catch (err) {
    console.error("Production PATCH error:", err);
    return NextResponse.json({ error: "Failed to update production" }, { status: 500 });
  }
}
