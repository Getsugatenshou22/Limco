import { NextResponse } from "next/server";
import { createCompanyLearnerAccount } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "company_admin" || !session.companyId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    rows?: Array<{ name: string; email: string }>;
  };

  if (!Array.isArray(body.rows) || body.rows.length === 0) {
    return NextResponse.json({ message: "rows are required." }, { status: 400 });
  }

  for (const row of body.rows) {
    if (!row.name || !row.email) {
      continue;
    }
    await createCompanyLearnerAccount(session.companyId, row.name, row.email);
  }

  return NextResponse.json({ success: true });
}
