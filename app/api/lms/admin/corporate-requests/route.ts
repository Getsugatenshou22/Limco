import { NextResponse } from "next/server";
import { applyCorporateRequestDecision } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    requestId?: string;
    decision?: "active" | "rejected";
  };

  if (!body.requestId || !body.decision) {
    return NextResponse.json({ message: "requestId and decision are required." }, { status: 400 });
  }

  await applyCorporateRequestDecision(body.requestId, body.decision);
  return NextResponse.json({ success: true });
}
