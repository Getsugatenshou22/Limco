import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/lms-auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ success: true });
}
