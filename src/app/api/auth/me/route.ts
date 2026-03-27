import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { initDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const user = await getSession();
  if (user) {
    return NextResponse.json({ authenticated: true, user });
  }
  return NextResponse.json({ authenticated: false });
}
