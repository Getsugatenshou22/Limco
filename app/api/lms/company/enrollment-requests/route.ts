import { NextResponse } from "next/server";
import { createCorporateEnrollmentRequest } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "company_admin" || !session.companyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    courseId?: string;
    learnerIds?: string[];
  };

  if (!body.courseId || !Array.isArray(body.learnerIds) || body.learnerIds.length === 0) {
    return NextResponse.json({ message: "courseId and learnerIds are required." }, { status: 400 });
  }

  await createCorporateEnrollmentRequest(session.companyId, body.courseId, body.learnerIds);
  return NextResponse.json({ success: true });
}
