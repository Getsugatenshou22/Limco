import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/lms-auth";
import { submitPaymentProofForEnrollment } from "@/lib/lms-backend";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const courseId = formData.get("courseId");
  const file = formData.get("file");

  if (typeof courseId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ message: "courseId and file are required." }, { status: 400 });
  }

  await submitPaymentProofForEnrollment(session.userId, courseId, file);
  return NextResponse.json({ success: true });
}
