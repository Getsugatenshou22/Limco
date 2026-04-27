import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/lms-auth";
import { readStoredUpload } from "@/lib/lms-backend";

export async function GET(request: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const relativePath = request.nextUrl.searchParams.get("path");
  if (!relativePath) {
    return NextResponse.json({ message: "Missing file path" }, { status: 400 });
  }

  const { buffer } = await readStoredUpload(relativePath);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `inline; filename="${relativePath.split("/").at(-1) ?? "download"}"`,
      "Cache-Control": "private, max-age=60",
    },
  });
}
