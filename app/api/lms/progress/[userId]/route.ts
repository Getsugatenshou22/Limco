import { NextResponse } from "next/server";
import { getPortalStateForSession } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

type ProgressRouteProps = {
  params: Promise<{ userId: string }>;
};

export async function GET(_: Request, { params }: ProgressRouteProps) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await params;
  if (session.role !== "admin" && session.userId !== userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const portalState = await getPortalStateForSession(session);
  return NextResponse.json({
    progress: portalState.courseStates.filter((entry) => entry.userId === userId).map((entry) => ({
      userId: entry.userId,
      courseId: entry.courseId,
      completedLessons: entry.completedLessons,
      progressPercentage: entry.progressPercentage,
      updatedAt:
        Object.values(entry.completionTimestamps).sort((a, b) => Date.parse(b) - Date.parse(a))[0] ??
        new Date().toISOString(),
    })),
  });
}
