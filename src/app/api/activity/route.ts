import { NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await query(
      "SELECT * FROM activity_log WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
      [user.id]
    );

    return NextResponse.json({ activities: result.rows });
  } catch (err) {
    console.error("Activity GET error:", err);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
