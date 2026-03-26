import { NextRequest, NextResponse } from "next/server";
import { query, initDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    await initDb();
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { username, email, bio } = await request.json();

    if (username && username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check uniqueness if changing
    if (username && username !== user.username) {
      const existing = await query("SELECT id FROM users WHERE username = $1 AND id != $2", [username, user.id]);
      if (existing.rows.length > 0) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    if (email && email !== user.email) {
      const existing = await query("SELECT id FROM users WHERE email = $1 AND id != $2", [email.toLowerCase(), user.id]);
      if (existing.rows.length > 0) return NextResponse.json({ error: "Email already taken" }, { status: 409 });
    }

    await query(
      "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4",
      [username || null, email ? email.toLowerCase() : null, bio !== undefined ? bio : null, user.id]
    );

    const updated = await query("SELECT id, username, email, role, bio FROM users WHERE id = $1", [user.id]);
    return NextResponse.json({ user: updated.rows[0] });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
