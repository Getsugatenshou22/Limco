import { NextResponse } from "next/server";
import { getPortalStateForSession } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function GET() {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const portalState = await getPortalStateForSession(session);
  return NextResponse.json({ portalState });
}
