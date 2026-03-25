import { cookies } from "next/headers";
import { query } from "./db";

const SESSION_COOKIE = "destane_session";

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const result = await query(
      "SELECT id, email, username, role FROM users WHERE id = $1",
      [parseInt(sessionId)]
    );
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

export async function setSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
