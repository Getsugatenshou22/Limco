import { describe, expect, it } from "vitest";
import { Course } from "@/lib/lms-data";
import {
  LmsPortalState,
  buildCertificateId,
  buildPaymentReference,
  exportReportingRowsToCsv,
  getApprovedCoursesForStudent,
  getFirstIncompleteLesson,
  getLearnerOverview,
  getReportingRows,
  getReportingSummary,
} from "@/lib/lms-store";

const mockCourse: Course = {
  id: "digital-work-readiness",
  title: "Digital Work Readiness",
  description: "desc",
  category: "Workplace Skills",
  level: "Beginner",
  price: 1800,
  media: [],
  modules: [
    {
      id: "module-1",
      title: "Foundations",
      lessons: [
        { id: "lesson-1", title: "Intro", type: "video", contentUrl: "/intro", duration: "10 min", summary: "Intro" },
        { id: "lesson-2", title: "Next", type: "text", contentUrl: "/next", duration: "5 min", summary: "Next" },
      ],
    },
  ],
};

const mockPortalState: LmsPortalState = {
  users: [
    { id: "student-001", name: "Naledi Mokoena", email: "naledi@example.com", role: "student" },
    { id: "company-admin-001", name: "Karabo Dlamini", email: "karabo@example.com", role: "company_admin", companyId: "company-001" },
  ],
  courses: [mockCourse],
  courseStates: [
    {
      userId: "student-001",
      courseId: mockCourse.id,
      progressPercentage: 50,
      completedLessons: ["lesson-1"],
      lastOpenedLessonId: "lesson-1",
      xpEarned: 10,
      completionTimestamps: { "lesson-1": "2026-04-27T08:00:00.000Z" },
      recentActivity: [
        {
          id: "activity-1",
          courseId: mockCourse.id,
          lessonId: "lesson-1",
          message: "You completed Intro",
          timestamp: "2026-04-27T08:00:00.000Z",
          type: "lesson_completed",
        },
      ],
    },
  ],
  enrollments: [
    {
      userId: "student-001",
      courseId: mockCourse.id,
      status: "approved",
      reference: buildPaymentReference("student-001", mockCourse.id),
    },
  ],
  paymentProofs: [
    {
      userId: "student-001",
      courseId: mockCourse.id,
      proofName: "proof.pdf",
      proofUrl: "/proof.pdf",
      status: "approved",
      uploadedAt: "2026-04-27T08:00:00.000Z",
    },
  ],
  companies: [
    {
      id: "company-001",
      name: "Ubuntu Operations Group",
      contactPerson: "Karabo Dlamini",
      email: "karabo@example.com",
      learners: [],
      enrollments: [],
      status: "active",
    },
  ],
  corporateRequests: [],
  certificates: [
    {
      id: buildCertificateId("student-001", mockCourse.id, "2026-04-27T08:00:00.000Z"),
      userId: "student-001",
      courseId: mockCourse.id,
      issuedAt: "2026-04-27T08:00:00.000Z",
      completionDate: "2026-04-27T08:00:00.000Z",
      filePath: "/certificates/sample.pdf",
      downloadUrl: "/api/lms/files?path=/certificates/sample.pdf",
      learnerName: "Naledi Mokoena",
      courseTitle: "Digital Work Readiness",
    },
  ],
  activityFeed: [
    {
      id: "feed-1",
      userId: "student-001",
      courseId: mockCourse.id,
      lessonId: "lesson-1",
      message: "Naledi Mokoena completed Intro.",
      timestamp: "2026-04-27T08:00:00.000Z",
      type: "lesson_completed",
    },
  ],
};

describe("lms-store workflows", () => {
  it("returns the next incomplete lesson for a learner", () => {
    const lesson = getFirstIncompleteLesson(mockCourse, ["lesson-1"]);
    expect(lesson?.id).toBe("lesson-2");
  });

  it("tracks learner overview and approved course access", () => {
    expect(getApprovedCoursesForStudent("student-001", mockPortalState)).toHaveLength(1);
    const overview = getLearnerOverview("student-001", mockPortalState);
    expect(overview.xpEarned).toBe(10);
    expect(overview.continueCourse?.course.id).toBe(mockCourse.id);
    expect(overview.certificates).toHaveLength(1);
  });

  it("builds reporting output and CSV exports", () => {
    const rows = getReportingRows(mockPortalState);
    const summary = getReportingSummary(mockPortalState, rows);
    const csv = exportReportingRowsToCsv(rows);

    expect(rows).toHaveLength(1);
    expect(summary.revenue).toBe(1800);
    expect(summary.certificatesIssued).toBe(1);
    expect(csv).toContain("Naledi Mokoena");
    expect(csv).toContain("Digital Work Readiness");
  });
});
