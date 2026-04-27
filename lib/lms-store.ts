import { Course, Lesson } from "@/lib/lms-data";

export type EnrollmentStatus = "not_enrolled" | "pending_payment" | "approved" | "rejected";
export type CompanyEnrollmentStatus = "pending_invoice" | "active" | "rejected";
export type CompletionFilter = "all" | "completed" | "in_progress" | "not_started";
export type CourseActivityType = "lesson_completed" | "module_completed";

export type LessonActivity = {
  id: string;
  courseId: string;
  lessonId: string;
  message: string;
  timestamp: string;
  type: CourseActivityType;
};

export type PortalActivity = {
  id: string;
  userId: string;
  courseId?: string;
  companyId?: string;
  lessonId?: string;
  message: string;
  timestamp: string;
  type:
    | "lesson_completed"
    | "module_completed"
    | "course_completed"
    | "certificate_issued"
    | "payment_submitted"
    | "enrollment_approved"
    | "corporate_request"
    | "corporate_request_approved";
};

export type CourseStateRecentActivity = LessonActivity;

export type LearnerCourseState = {
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedLessons: string[];
  lastOpenedLessonId: string | null;
  xpEarned: number;
  completionTimestamps: Record<string, string>;
  recentActivity: CourseStateRecentActivity[];
};

export type EnrollmentRecord = {
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  reference: string;
  companyId?: string;
  submittedAt?: string;
  reviewedAt?: string;
};

export type PaymentProofRecord = {
  userId: string;
  courseId: string;
  proofName: string;
  proofUrl: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: string;
};

export type CompanyLearner = {
  id: string;
  name: string;
  email: string;
  status: "active" | "invited";
  invitedAt: string;
};

export type CompanyProfile = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  learners: CompanyLearner[];
  enrollments: string[];
  status: "active" | "pending" | "inactive";
};

export type CompanyEnrollmentRequest = {
  id: string;
  companyId: string;
  courseId: string;
  learnerIds: string[];
  invoiceReference: string;
  totalAmount: number;
  status: CompanyEnrollmentStatus;
  requestedAt: string;
  reviewedAt?: string;
};

export type CertificateRecord = {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  completionDate: string;
  filePath: string;
  downloadUrl: string;
  learnerName: string;
  courseTitle: string;
};

export type ReportingRow = {
  id: string;
  learnerId: string;
  learnerName: string;
  companyId?: string;
  companyName?: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  status: "not_started" | "in_progress" | "completed";
  enrollmentStatus: EnrollmentStatus | CompanyEnrollmentStatus | "active";
  hasCertificate: boolean;
};

export type ReportingSummary = {
  totalLearners: number;
  activeLearners: number;
  completedCourses: number;
  certificatesIssued: number;
  revenue: number;
  pendingPayments: number;
  approvedPayments: number;
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin" | "company_admin";
  companyId?: string;
};

export type LmsPortalState = {
  users: PortalUser[];
  courses: Course[];
  courseStates: LearnerCourseState[];
  enrollments: EnrollmentRecord[];
  paymentProofs: PaymentProofRecord[];
  companies: CompanyProfile[];
  corporateRequests: CompanyEnrollmentRequest[];
  certificates: CertificateRecord[];
  activityFeed: PortalActivity[];
};

export const bankingDetails = {
  bankName: "First National Bank",
  accountName: "Limco Consulting and Management",
  accountNumber: "62839450291",
};

export function buildPaymentReference(userId: string, courseId: string) {
  return `${userId.toUpperCase()}-${courseId.slice(0, 6).toUpperCase()}`;
}

export function buildInvoiceReference(companyId: string, courseId: string) {
  return `INV-${companyId.slice(-3).toUpperCase()}-${courseId.slice(0, 4).toUpperCase()}`;
}

export function buildCertificateId(userId: string, courseId: string, issuedAt: string) {
  return `CERT-${userId.slice(-3).toUpperCase()}-${courseId.slice(0, 4).toUpperCase()}-${issuedAt.slice(2, 10).replaceAll("-", "")}`;
}

export function flattenCourseLessons(course: Course) {
  return course.modules.flatMap((courseModule) => courseModule.lessons);
}

export function getFirstIncompleteLesson(course: Course, completedLessons: string[]) {
  return (
    flattenCourseLessons(course).find((lesson) => !completedLessons.includes(lesson.id)) ??
    course.modules[0]?.lessons[0] ??
    null
  );
}

export function getNextLesson(course: Course, lessonId: string) {
  const lessons = flattenCourseLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] ?? null : null;
}

export function getPreviousLesson(course: Course, lessonId: string) {
  const lessons = flattenCourseLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index > 0 ? lessons[index - 1] : null;
}

export function getModuleByLessonId(course: Course, lessonId: string) {
  return course.modules.find((courseModule) => courseModule.lessons.some((lesson) => lesson.id === lessonId)) ?? null;
}

export function isModuleCompleted(course: Course, moduleId: string, completedLessonIds: string[]) {
  const courseModule = course.modules.find((item) => item.id === moduleId);
  return courseModule ? courseModule.lessons.every((lesson) => completedLessonIds.includes(lesson.id)) : false;
}

export function getEnrollmentRecord(portalState: LmsPortalState, userId: string, courseId: string) {
  return portalState.enrollments.find((entry) => entry.userId === userId && entry.courseId === courseId);
}

export function getPaymentProof(portalState: LmsPortalState, userId: string, courseId: string) {
  return portalState.paymentProofs.find((entry) => entry.userId === userId && entry.courseId === courseId);
}

export function getCompanyById(portalState: LmsPortalState, companyId: string) {
  return portalState.companies.find((entry) => entry.id === companyId) ?? null;
}

export function getCorporateRequest(portalState: LmsPortalState, requestId: string) {
  return portalState.corporateRequests.find((entry) => entry.id === requestId) ?? null;
}

export function getPortalCourseState(portalState: LmsPortalState, userId: string, courseId: string) {
  return portalState.courseStates.find((entry) => entry.userId === userId && entry.courseId === courseId) ?? null;
}

export function getPortalUser(portalState: LmsPortalState, userId: string) {
  return portalState.users.find((entry) => entry.id === userId) ?? null;
}

export function getCourseTitle(portalState: LmsPortalState, courseId: string) {
  return portalState.courses.find((course) => course.id === courseId)?.title ?? "Course";
}

export function getCertificateForCourse(portalState: LmsPortalState, userId: string, courseId: string) {
  return portalState.certificates.find((certificate) => certificate.userId === userId && certificate.courseId === courseId) ?? null;
}

export function getCertificatesForUser(portalState: LmsPortalState, userId: string) {
  return portalState.certificates
    .filter((certificate) => certificate.userId === userId)
    .sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
}

export function getCertificatesForCompany(portalState: LmsPortalState, companyId: string) {
  const learnerIds = new Set(portalState.users.filter((user) => user.companyId === companyId).map((user) => user.id));
  return portalState.certificates
    .filter((certificate) => learnerIds.has(certificate.userId))
    .sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
}

export function getApprovedCoursesForStudent(userId: string, portalState: LmsPortalState) {
  const approvedCourseIds = new Set(
    portalState.enrollments
      .filter((entry) => entry.userId === userId && entry.status === "approved")
      .map((entry) => entry.courseId),
  );

  return portalState.courses.filter((course) => approvedCourseIds.has(course.id));
}

export function createDefaultCourseState(userId: string, courseId: string): LearnerCourseState {
  return {
    userId,
    courseId,
    progressPercentage: 0,
    completedLessons: [],
    lastOpenedLessonId: null,
    xpEarned: 0,
    completionTimestamps: {},
    recentActivity: [],
  };
}

export function createLocalCourseState(userId: string, course: Course, portalState: LmsPortalState) {
  const sourceState = getPortalCourseState(portalState, userId, course.id);
  const completedLessons = sourceState?.completedLessons ?? [];

  return {
    userId,
    courseId: course.id,
    completedLessons: [...completedLessons],
    progressPercentage: sourceState?.progressPercentage ?? 0,
    lastOpenedLessonId:
      sourceState?.lastOpenedLessonId ??
      getFirstIncompleteLesson(course, completedLessons)?.id ??
      flattenCourseLessons(course)[0]?.id ??
      null,
    xpEarned: sourceState?.xpEarned ?? completedLessons.length * 10,
    completionTimestamps: { ...(sourceState?.completionTimestamps ?? {}) },
    recentActivity: [...(sourceState?.recentActivity ?? [])],
  };
}

export function buildCompletionMessage(lesson: Lesson) {
  return `You completed ${lesson.title}`;
}

export function getLearnerOverview(userId: string, portalState: LmsPortalState) {
  const courseStates = portalState.courseStates.filter((entry) => entry.userId === userId);
  const approvedCourses = getApprovedCoursesForStudent(userId, portalState);
  const xpEarned = courseStates.reduce((sum, courseState) => sum + courseState.xpEarned, 0);
  const recentActivity = portalState.activityFeed
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const continueCourse =
    approvedCourses
      .map((course) => ({
        course,
        state: courseStates.find((courseState) => courseState.courseId === course.id),
      }))
      .sort((a, b) => {
        const aTime = a.state?.recentActivity[0]?.timestamp ? Date.parse(a.state.recentActivity[0].timestamp) : 0;
        const bTime = b.state?.recentActivity[0]?.timestamp ? Date.parse(b.state.recentActivity[0].timestamp) : 0;
        return bTime - aTime;
      })
      .find(({ state }) => (state?.progressPercentage ?? 0) < 100) ?? null;

  return {
    xpEarned,
    recentActivity,
    continueCourse,
    approvedCourseIds: approvedCourses.map((course) => course.id),
    certificates: getCertificatesForUser(portalState, userId),
  };
}

export function getCompanyOverview(companyId: string, portalState: LmsPortalState) {
  const company = getCompanyById(portalState, companyId);

  if (!company) {
    return {
      company: null,
      activeCourses: 0,
      pendingRequests: 0,
      totalLearners: 0,
      activeLearnerSeats: 0,
      reportingSummary: {
        totalLearners: 0,
        activeLearners: 0,
        completedCourses: 0,
        certificatesIssued: 0,
        revenue: 0,
        pendingPayments: 0,
        approvedPayments: 0,
      } satisfies ReportingSummary,
    };
  }

  const relatedRequests = portalState.corporateRequests.filter((entry) => entry.companyId === companyId);
  const activeRequests = relatedRequests.filter((entry) => entry.status === "active");
  const activeCourseIds = new Set(activeRequests.map((entry) => entry.courseId));
  const activeLearnerSeats = activeRequests.reduce((sum, entry) => sum + entry.learnerIds.length, 0);
  const reportRows = getReportingRows(portalState, { companyId });

  return {
    company,
    activeCourses: activeCourseIds.size,
    pendingRequests: relatedRequests.filter((entry) => entry.status === "pending_invoice").length,
    totalLearners: company.learners.length,
    activeLearnerSeats,
    reportingSummary: getReportingSummary(portalState, reportRows),
  };
}

export function getReportingRows(
  portalState: LmsPortalState,
  filters?: {
    companyId?: string;
    courseId?: string;
    completionStatus?: CompletionFilter;
  },
) {
  return portalState.enrollments
    .filter((enrollment) => enrollment.status !== "not_enrolled")
    .map((enrollment) => {
      const user = getPortalUser(portalState, enrollment.userId);
      const course = portalState.courses.find((entry) => entry.id === enrollment.courseId);
      const courseState = getPortalCourseState(portalState, enrollment.userId, enrollment.courseId);
      const progressPercentage = courseState?.progressPercentage ?? 0;
      const status: ReportingRow["status"] =
        progressPercentage >= 100 ? "completed" : progressPercentage > 0 ? "in_progress" : "not_started";
      const company =
        (enrollment.companyId ? getCompanyById(portalState, enrollment.companyId) : null) ??
        (user?.companyId ? getCompanyById(portalState, user.companyId) : null);

      return {
        id: `${enrollment.userId}-${enrollment.courseId}`,
        learnerId: enrollment.userId,
        learnerName: user?.name ?? "Learner",
        companyId: company?.id,
        companyName: company?.name,
        courseId: enrollment.courseId,
        courseTitle: course?.title ?? "Course",
        progressPercentage,
        status,
        enrollmentStatus: company && enrollment.status === "approved" ? "active" : enrollment.status,
        hasCertificate: Boolean(getCertificateForCourse(portalState, enrollment.userId, enrollment.courseId)),
      } satisfies ReportingRow;
    })
    .filter((row) => {
      if (filters?.companyId && row.companyId !== filters.companyId) {
        return false;
      }
      if (filters?.courseId && filters.courseId !== "all" && row.courseId !== filters.courseId) {
        return false;
      }
      if (filters?.completionStatus && filters.completionStatus !== "all" && row.status !== filters.completionStatus) {
        return false;
      }
      return true;
    });
}

export function getReportingSummary(portalState: LmsPortalState, rows: ReportingRow[]): ReportingSummary {
  return {
    totalLearners: new Set(rows.map((row) => row.learnerId)).size,
    activeLearners: new Set(rows.filter((row) => row.progressPercentage > 0).map((row) => row.learnerId)).size,
    completedCourses: rows.filter((row) => row.status === "completed").length,
    certificatesIssued: rows.filter((row) => row.hasCertificate).length,
    revenue: rows.reduce((sum, row) => {
      const course = portalState.courses.find((entry) => entry.id === row.courseId);
      return sum + ((row.enrollmentStatus === "approved" || row.enrollmentStatus === "active") ? course?.price ?? 0 : 0);
    }, 0),
    pendingPayments: portalState.paymentProofs.filter((entry) => entry.status === "pending").length,
    approvedPayments: portalState.paymentProofs.filter((entry) => entry.status === "approved").length,
  };
}

export function exportReportingRowsToCsv(rows: ReportingRow[]) {
  const header = ["Learner Name", "Course", "Progress %", "Status", "Company", "Certificate"];
  const body = rows.map((row) =>
    [
      escapeCsv(row.learnerName),
      escapeCsv(row.courseTitle),
      String(row.progressPercentage),
      escapeCsv(row.status.replaceAll("_", " ")),
      escapeCsv(row.companyName ?? "Independent"),
      row.hasCertificate ? "Yes" : "No",
    ].join(","),
  );

  return [header.join(","), ...body].join("\n");
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
