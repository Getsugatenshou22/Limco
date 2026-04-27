import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { getAppEnv } from "@/lib/env";
import { saveBufferToUploads, getDownloadUrl } from "@/lib/lms-files";
import { sendLmsMail } from "@/lib/lms-mail";
import { Course, lmsCourses, lmsProgressSeed, lmsStudents } from "@/lib/lms-data";
import { LmsSession, LmsSessionRole } from "@/lib/lms-auth";
import {
  CompanyEnrollmentRequest,
  CompanyProfile,
  CompletionFilter,
  CourseActivityType,
  CourseStateRecentActivity,
  EnrollmentRecord,
  EnrollmentStatus,
  LearnerCourseState,
  PaymentProofRecord,
  PortalActivity,
  ReportingRow,
  ReportingSummary,
  CertificateRecord,
  LmsPortalState,
  buildCertificateId,
  buildInvoiceReference,
  buildPaymentReference,
  createDefaultCourseState,
  exportReportingRowsToCsv,
  flattenCourseLessons,
  getFirstIncompleteLesson,
  isModuleCompleted,
} from "@/lib/lms-store";

type DbUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: LmsSessionRole;
  company_id: string | null;
};

type DbCourseProgress = {
  user_id: string;
  course_id: string;
  progress_percentage: number;
  completed_lessons: unknown;
  last_opened_lesson_id: string | null;
  xp_earned: number;
  completion_timestamps: unknown;
  recent_activity: unknown;
};

type PortalUser = {
  id: string;
  name: string;
  email: string;
  role: LmsSessionRole;
  companyId?: string;
};

declare global {
  var __limcoLmsReady: Promise<void> | undefined;
}

const DEMO_PASSWORD = "Pass@123";

const adminSeed = {
  id: "admin-001",
  name: "LMS Administrator",
  email: "admin@limco.co.za",
  role: "admin" as const,
};

function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

export async function ensureLmsReady() {
  if (!global.__limcoLmsReady) {
    global.__limcoLmsReady = initializeLms();
  }

  return global.__limcoLmsReady;
}

async function initializeLms() {
  const db = getDb();

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_companies (
      id VARCHAR(191) PRIMARY KEY,
      name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_users (
      id VARCHAR(191) PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      company_id VARCHAR(191),
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      CONSTRAINT fk_lms_users_company FOREIGN KEY (company_id) REFERENCES lms_companies(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_courses (
      id VARCHAR(191) PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      price INTEGER NOT NULL,
      media JSON NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_modules (
      id VARCHAR(191) PRIMARY KEY,
      course_id VARCHAR(191) NOT NULL,
      title TEXT NOT NULL,
      position INTEGER NOT NULL,
      CONSTRAINT fk_lms_modules_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_lessons (
      id VARCHAR(191) PRIMARY KEY,
      module_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      content_url TEXT NOT NULL,
      duration TEXT NOT NULL,
      summary TEXT NOT NULL,
      asset_path TEXT,
      position INTEGER NOT NULL,
      CONSTRAINT fk_lms_lessons_module FOREIGN KEY (module_id) REFERENCES lms_modules(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_lessons_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_enrollments (
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      status TEXT NOT NULL,
      reference TEXT NOT NULL,
      company_id VARCHAR(191),
      submitted_at DATETIME(3),
      reviewed_at DATETIME(3),
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (user_id, course_id),
      CONSTRAINT fk_lms_enrollments_user FOREIGN KEY (user_id) REFERENCES lms_users(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_enrollments_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_enrollments_company FOREIGN KEY (company_id) REFERENCES lms_companies(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_payment_proofs (
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      proof_name TEXT NOT NULL,
      proof_path TEXT NOT NULL,
      mime_type TEXT,
      status TEXT NOT NULL,
      uploaded_at DATETIME(3) NOT NULL,
      PRIMARY KEY (user_id, course_id),
      CONSTRAINT fk_lms_payment_proofs_user FOREIGN KEY (user_id) REFERENCES lms_users(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_payment_proofs_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_course_progress (
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      progress_percentage INTEGER NOT NULL DEFAULT 0,
      completed_lessons JSON NOT NULL,
      last_opened_lesson_id TEXT,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      completion_timestamps JSON NOT NULL,
      recent_activity JSON NOT NULL,
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (user_id, course_id),
      CONSTRAINT fk_lms_course_progress_user FOREIGN KEY (user_id) REFERENCES lms_users(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_course_progress_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_corporate_requests (
      id VARCHAR(191) PRIMARY KEY,
      company_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      learner_ids JSON NOT NULL,
      invoice_reference TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      requested_at DATETIME(3) NOT NULL,
      reviewed_at DATETIME(3),
      CONSTRAINT fk_lms_corporate_requests_company FOREIGN KEY (company_id) REFERENCES lms_companies(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_corporate_requests_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_certificates (
      id VARCHAR(191) PRIMARY KEY,
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191) NOT NULL,
      issued_at DATETIME(3) NOT NULL,
      completion_date DATETIME(3) NOT NULL,
      file_path TEXT NOT NULL
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_activity_feed (
      id VARCHAR(191) PRIMARY KEY,
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191),
      company_id VARCHAR(191),
      lesson_id TEXT,
      message TEXT NOT NULL,
      timestamp DATETIME(3) NOT NULL,
      type TEXT NOT NULL,
      CONSTRAINT fk_lms_activity_feed_user FOREIGN KEY (user_id) REFERENCES lms_users(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_activity_feed_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE SET NULL,
      CONSTRAINT fk_lms_activity_feed_company FOREIGN KEY (company_id) REFERENCES lms_companies(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS lms_achievements (
      id VARCHAR(191) PRIMARY KEY,
      user_id VARCHAR(191) NOT NULL,
      course_id VARCHAR(191),
      achievement_type TEXT NOT NULL,
      label TEXT NOT NULL,
      awarded_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      CONSTRAINT fk_lms_achievements_user FOREIGN KEY (user_id) REFERENCES lms_users(id) ON DELETE CASCADE,
      CONSTRAINT fk_lms_achievements_course FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `);

  const { rows } = await db.query<{ count: number }>("SELECT COUNT(*) AS count FROM lms_users");
  if ((rows[0]?.count ?? 0) !== 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await db.query(
    `INSERT INTO lms_companies (id, name, contact_person, email, status)
     VALUES (?, ?, ?, ?, ?)`,
    ["company-001", "Ubuntu Operations Group", "Karabo Dlamini", "karabo@ubuntuoperations.co.za", "active"],
  );

  for (const user of [...lmsStudents, adminSeed]) {
    await db.query(
      `INSERT INTO lms_users (id, name, email, password_hash, role, company_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, passwordHash, user.role, "companyId" in user ? user.companyId ?? null : null],
    );
  }

  for (const course of lmsCourses) {
    await db.query(
      `INSERT INTO lms_courses (id, title, description, category, level, price, media)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [course.id, course.title, course.description, course.category, course.level, course.price, JSON.stringify(course.media)],
    );

    for (const [moduleIndex, module] of course.modules.entries()) {
      await db.query(
        `INSERT INTO lms_modules (id, course_id, title, position)
         VALUES (?, ?, ?, ?)`,
        [module.id, course.id, module.title, moduleIndex],
      );

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        await db.query(
          `INSERT INTO lms_lessons (id, module_id, course_id, title, type, content_url, duration, summary, position)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            lesson.id,
            module.id,
            course.id,
            lesson.title,
            lesson.type,
            lesson.contentUrl,
            lesson.duration,
            lesson.summary,
            lessonIndex,
          ],
        );
      }
    }
  }

  for (const student of lmsStudents.filter((entry) => entry.role === "student")) {
    for (const course of lmsCourses) {
      const approved = student.enrolledCourseIds.includes(course.id);
      await db.query(
        `INSERT INTO lms_enrollments (user_id, course_id, status, reference, company_id, reviewed_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          student.id,
          course.id,
          approved ? "approved" : "not_enrolled",
          buildPaymentReference(student.id, course.id),
          student.companyId ?? null,
          approved ? new Date().toISOString() : null,
        ],
      );
    }
  }

  for (const progress of lmsProgressSeed) {
      await db.query(
        `INSERT INTO lms_course_progress (
        user_id,
        course_id,
        progress_percentage,
        completed_lessons,
        last_opened_lesson_id,
        xp_earned,
        completion_timestamps,
        recent_activity,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        progress.userId,
        progress.courseId,
        progress.progressPercentage,
        JSON.stringify(progress.completedLessons),
        progress.completedLessons.at(-1) ?? null,
        progress.completedLessons.length * 10,
        JSON.stringify(
          Object.fromEntries(
            progress.completedLessons.map((lessonId, index) => [
              lessonId,
              new Date(Date.parse(progress.updatedAt) - index * 60 * 60 * 1000).toISOString(),
            ]),
          ),
        ),
        JSON.stringify(
          progress.completedLessons.map((lessonId, index) => ({
            id: `${progress.courseId}-${lessonId}-${index}`,
            courseId: progress.courseId,
            lessonId,
            message: `You completed ${lessonId}`,
            timestamp: new Date(Date.parse(progress.updatedAt) - index * 60 * 60 * 1000).toISOString(),
            type: "lesson_completed",
          })),
        ),
        progress.updatedAt,
      ],
    );
  }

  await db.query(
    `INSERT INTO lms_corporate_requests (id, company_id, course_id, learner_ids, invoice_reference, total_amount, status, requested_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "corp-request-001",
      "company-001",
      "digital-work-readiness",
      JSON.stringify(["company-learner-001", "company-learner-002"]),
      buildInvoiceReference("company-001", "digital-work-readiness"),
      3600,
      "pending_invoice",
      new Date().toISOString(),
    ],
  );
}

async function getUsersMap() {
  await ensureLmsReady();
  const db = getDb();
  const { rows } = await db.query<DbUser>(
    "SELECT id, name, email, password_hash, role, company_id FROM lms_users ORDER BY created_at ASC",
  );
  return new Map(rows.map((user) => [user.id, user]));
}

async function getCourses() {
  await ensureLmsReady();
  const db = getDb();
  const { rows: courseRows } = await db.query<{
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    media: unknown;
  }>("SELECT id, title, description, category, level, price, media FROM lms_courses ORDER BY created_at ASC");
  const { rows: moduleRows } = await db.query<{
    id: string;
    course_id: string;
    title: string;
    position: number;
  }>("SELECT id, course_id, title, position FROM lms_modules ORDER BY position ASC");
  const { rows: lessonRows } = await db.query<{
    id: string;
    module_id: string;
    course_id: string;
    title: string;
    type: "video" | "pdf" | "text";
    content_url: string;
    duration: string;
    summary: string;
    asset_path: string | null;
    position: number;
  }>("SELECT id, module_id, course_id, title, type, content_url, duration, summary, asset_path, position FROM lms_lessons ORDER BY position ASC");

  return courseRows.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    price: Number(course.price),
    media: parseJsonValue<string[]>(course.media, []),
    modules: moduleRows
      .filter((module) => module.course_id === course.id)
      .map((module) => ({
        id: module.id,
        title: module.title,
        lessons: lessonRows
          .filter((lesson) => lesson.course_id === course.id && lesson.module_id === module.id)
          .map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            type: lesson.type,
            contentUrl: lesson.asset_path ? getDownloadUrl(lesson.asset_path) : lesson.content_url,
            duration: lesson.duration,
            summary: lesson.summary,
          })),
      })),
  })) satisfies Course[];
}

export async function getCourseByIdFromDb(courseId: string) {
  const courses = await getCourses();
  return courses.find((course) => course.id === courseId) ?? null;
}

async function buildPortalState(): Promise<LmsPortalState> {
  await ensureLmsReady();
  const db = getDb();
  const usersMap = await getUsersMap();
  const courses = await getCourses();

  const [enrollmentsResult, paymentsResult, progressResult, companiesResult, corporateResult, certificateResult, activityResult] =
    await Promise.all([
      db.query<{
        user_id: string;
        course_id: string;
        status: EnrollmentStatus;
        reference: string;
        company_id: string | null;
        submitted_at: string | null;
        reviewed_at: string | null;
      }>("SELECT user_id, course_id, status, reference, company_id, submitted_at, reviewed_at FROM lms_enrollments"),
      db.query<{
        user_id: string;
        course_id: string;
        proof_name: string;
        proof_path: string;
        status: "pending" | "approved" | "rejected";
        uploaded_at: string;
      }>("SELECT user_id, course_id, proof_name, proof_path, status, uploaded_at FROM lms_payment_proofs"),
      db.query<DbCourseProgress>(
        "SELECT user_id, course_id, progress_percentage, completed_lessons, last_opened_lesson_id, xp_earned, completion_timestamps, recent_activity FROM lms_course_progress",
      ),
      db.query<{
        id: string;
        name: string;
        contact_person: string;
        email: string;
        status: "active" | "pending" | "inactive";
      }>("SELECT id, name, contact_person, email, status FROM lms_companies"),
      db.query<{
        id: string;
        company_id: string;
        course_id: string;
        learner_ids: unknown;
        invoice_reference: string;
        total_amount: number;
        status: "pending_invoice" | "active" | "rejected";
        requested_at: string;
        reviewed_at: string | null;
      }>("SELECT id, company_id, course_id, learner_ids, invoice_reference, total_amount, status, requested_at, reviewed_at FROM lms_corporate_requests"),
      db.query<{
        id: string;
        user_id: string;
        course_id: string;
        issued_at: string;
        completion_date: string;
        file_path: string;
      }>("SELECT id, user_id, course_id, issued_at, completion_date, file_path FROM lms_certificates"),
      db.query<{
        id: string;
        user_id: string;
        course_id: string | null;
        company_id: string | null;
        lesson_id: string | null;
        message: string;
        timestamp: string;
        type: PortalActivity["type"];
      }>("SELECT id, user_id, course_id, company_id, lesson_id, message, timestamp, type FROM lms_activity_feed ORDER BY timestamp DESC"),
    ]);

  const users: PortalUser[] = Array.from(usersMap.values()).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.company_id ?? undefined,
  }));

  const courseStates: LearnerCourseState[] = progressResult.rows.map((row) => ({
    userId: row.user_id,
    courseId: row.course_id,
    progressPercentage: row.progress_percentage,
    completedLessons: parseJsonValue<string[]>(row.completed_lessons, []),
    lastOpenedLessonId: row.last_opened_lesson_id,
    xpEarned: row.xp_earned,
    completionTimestamps: parseJsonValue<Record<string, string>>(row.completion_timestamps, {}),
    recentActivity: parseJsonValue<CourseStateRecentActivity[]>(row.recent_activity, []),
  }));

  const companies: CompanyProfile[] = companiesResult.rows.map((company) => ({
    id: company.id,
    name: company.name,
    contactPerson: company.contact_person,
    email: company.email,
    learners: users
      .filter((user) => user.companyId === company.id && user.role === "student")
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: "active",
        invitedAt: new Date().toISOString(),
      })),
    enrollments: corporateResult.rows.filter((request) => request.company_id === company.id).map((request) => request.id),
    status: company.status,
  }));

  const certificates: CertificateRecord[] = certificateResult.rows.map((certificate) => ({
    id: certificate.id,
    userId: certificate.user_id,
    courseId: certificate.course_id,
    issuedAt: certificate.issued_at,
    completionDate: certificate.completion_date,
    filePath: certificate.file_path,
    downloadUrl: getDownloadUrl(certificate.file_path),
    learnerName: usersMap.get(certificate.user_id)?.name ?? "Learner",
    courseTitle: courses.find((course) => course.id === certificate.course_id)?.title ?? "Course",
  }));

  return {
    users,
    courses,
    courseStates,
    enrollments: enrollmentsResult.rows.map((row) => ({
      userId: row.user_id,
      courseId: row.course_id,
      status: row.status,
      reference: row.reference,
      companyId: row.company_id ?? undefined,
      submittedAt: row.submitted_at ?? undefined,
      reviewedAt: row.reviewed_at ?? undefined,
    })),
    paymentProofs: paymentsResult.rows.map((row) => ({
      userId: row.user_id,
      courseId: row.course_id,
      proofName: row.proof_name,
      proofUrl: getDownloadUrl(row.proof_path),
      status: row.status,
      uploadedAt: row.uploaded_at,
    })),
    companies,
    corporateRequests: corporateResult.rows.map((row) => ({
      id: row.id,
      companyId: row.company_id,
      courseId: row.course_id,
      learnerIds: parseJsonValue<string[]>(row.learner_ids, []),
      invoiceReference: row.invoice_reference,
      totalAmount: row.total_amount,
      status: row.status,
      requestedAt: row.requested_at,
      reviewedAt: row.reviewed_at ?? undefined,
    })),
    certificates,
    activityFeed: activityResult.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      courseId: row.course_id ?? undefined,
      companyId: row.company_id ?? undefined,
      lessonId: row.lesson_id ?? undefined,
      message: row.message,
      timestamp: row.timestamp,
      type: row.type,
    })),
  };
}

function getPortalUser(portalState: LmsPortalState, userId: string) {
  return portalState.users.find((user) => user.id === userId) ?? null;
}

async function appendActivity(entry: PortalActivity) {
  const db = getDb();
  await db.query(
    `INSERT INTO lms_activity_feed (id, user_id, course_id, company_id, lesson_id, message, timestamp, type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.userId,
      entry.courseId ?? null,
      entry.companyId ?? null,
      entry.lessonId ?? null,
      entry.message,
      entry.timestamp,
      entry.type,
    ],
  );
}

export async function authenticateLmsUser(email: string, password: string) {
  await ensureLmsReady();
  const db = getDb();
  const { rows } = await db.query<DbUser>(
    "SELECT id, name, email, password_hash, role, company_id FROM lms_users WHERE lower(email) = lower(?) LIMIT 1",
    [email],
  );
  const user = rows[0];

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return null;
  }

  return {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    companyId: user.company_id ?? undefined,
  } satisfies LmsSession;
}

export async function getPortalStateForSession(session: LmsSession) {
  const portalState = await buildPortalState();

  if (session.role === "student") {
    return {
      ...portalState,
      enrollments: portalState.enrollments.filter((entry) => entry.userId === session.userId),
      paymentProofs: portalState.paymentProofs.filter((entry) => entry.userId === session.userId),
      courseStates: portalState.courseStates.filter((entry) => entry.userId === session.userId),
      certificates: portalState.certificates.filter((entry) => entry.userId === session.userId),
      activityFeed: portalState.activityFeed.filter((entry) => entry.userId === session.userId),
      corporateRequests: session.companyId
        ? portalState.corporateRequests.filter((entry) => entry.companyId === session.companyId)
        : [],
      companies: session.companyId ? portalState.companies.filter((entry) => entry.id === session.companyId) : [],
    } satisfies LmsPortalState;
  }

  if (session.role === "company_admin") {
    return {
      ...portalState,
      companies: session.companyId ? portalState.companies.filter((entry) => entry.id === session.companyId) : [],
      corporateRequests: session.companyId
        ? portalState.corporateRequests.filter((entry) => entry.companyId === session.companyId)
        : [],
      certificates: session.companyId
        ? portalState.certificates.filter((entry) =>
            portalState.users.some((user) => user.id === entry.userId && user.companyId === session.companyId),
          )
        : [],
      activityFeed: session.companyId
        ? portalState.activityFeed.filter(
            (entry) =>
              entry.companyId === session.companyId ||
              portalState.users.some((user) => user.id === entry.userId && user.companyId === session.companyId),
          )
        : [],
      enrollments: session.companyId
        ? portalState.enrollments.filter((entry) => entry.companyId === session.companyId)
        : [],
      courseStates: session.companyId
        ? portalState.courseStates.filter((entry) =>
            portalState.users.some((user) => user.id === entry.userId && user.companyId === session.companyId),
          )
        : [],
      paymentProofs: session.companyId
        ? portalState.paymentProofs.filter((entry) =>
            portalState.users.some((user) => user.id === entry.userId && user.companyId === session.companyId),
          )
        : [],
      users: session.companyId
        ? portalState.users.filter((user) => user.companyId === session.companyId || user.id === session.userId)
        : [getPortalUser(portalState, session.userId)].filter(Boolean) as PortalUser[],
    } satisfies LmsPortalState;
  }

  return portalState;
}

export async function updateLastOpenedLesson(userId: string, courseId: string, lessonId: string) {
  await ensureLmsReady();
  const db = getDb();
  await db.query(
    `INSERT INTO lms_course_progress (
      user_id,
      course_id,
      progress_percentage,
      completed_lessons,
      last_opened_lesson_id,
      xp_earned,
      completion_timestamps,
      recent_activity,
      updated_at
    )
    VALUES (?, ?, 0, ?, ?, 0, ?, ?, NOW(3))
    ON DUPLICATE KEY UPDATE last_opened_lesson_id = VALUES(last_opened_lesson_id), updated_at = NOW(3)`,
    [userId, courseId, JSON.stringify([]), lessonId, JSON.stringify({}), JSON.stringify([])],
  );
}

async function issueCertificate(userId: string, courseId: string, completionDate: string, portalState: LmsPortalState) {
  const learner = portalState.users.find((user) => user.id === userId);
  const course = portalState.courses.find((entry) => entry.id === courseId);

  if (!learner || !course) {
    throw new Error("Unable to issue certificate because learner or course was not found.");
  }

  const certificateId = buildCertificateId(userId, courseId, completionDate);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 28,
    y: 28,
    width: 786,
    height: 539,
    borderColor: rgb(0.78, 0.63, 0.25),
    borderWidth: 3,
  });
  page.drawText("Limco Consulting & Management", {
    x: 245,
    y: 500,
    size: 22,
    font: bold,
    color: rgb(0.06, 0.16, 0.34),
  });
  page.drawText("Certificate of Completion", {
    x: 245,
    y: 445,
    size: 28,
    font: bold,
    color: rgb(0.06, 0.16, 0.34),
  });
  page.drawText("This certifies that", {
    x: 340,
    y: 395,
    size: 16,
    font: regular,
  });
  page.drawText(learner.name, {
    x: 300,
    y: 348,
    size: 24,
    font: bold,
    color: rgb(0.78, 0.63, 0.25),
  });
  page.drawText("has successfully completed", {
    x: 308,
    y: 305,
    size: 16,
    font: regular,
  });
  page.drawText(course.title, {
    x: 250,
    y: 260,
    size: 22,
    font: bold,
    color: rgb(0.06, 0.16, 0.34),
  });
  page.drawText(`Completion date: ${new Date(completionDate).toLocaleDateString("en-ZA")}`, {
    x: 285,
    y: 210,
    size: 14,
    font: regular,
  });
  page.drawText(`Certificate ID: ${certificateId}`, {
    x: 300,
    y: 185,
    size: 12,
    font: regular,
  });

  const bytes = await pdf.save();
  const stored = await saveBufferToUploads("certificateDir", `${certificateId}.pdf`, Buffer.from(bytes));
  const db = getDb();

  await db.query(
    `INSERT INTO lms_certificates (id, user_id, course_id, issued_at, completion_date, file_path)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE id = id`,
    [certificateId, userId, courseId, completionDate, completionDate, stored.relativePath],
  );

  await appendActivity({
    id: `certificate-${certificateId}`,
    userId,
    courseId,
    message: `Certificate issued for ${learner.name} in ${course.title}.`,
    timestamp: completionDate,
    type: "certificate_issued",
  });

  return certificateId;
}

export async function completeLessonForUser(userId: string, courseId: string, lessonId: string) {
  const portalState = await buildPortalState();
  const course = portalState.courses.find((entry) => entry.id === courseId);

  if (!course) {
    throw new Error("Course not found.");
  }

  const lesson = flattenCourseLessons(course).find((entry) => entry.id === lessonId);
  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  const existing =
    portalState.courseStates.find((entry) => entry.userId === userId && entry.courseId === courseId) ??
    createDefaultCourseState(userId, courseId);

  if (existing.completedLessons.includes(lessonId)) {
    return existing;
  }

  const now = new Date().toISOString();
  const completedLessons = [...existing.completedLessons, lessonId];
  const currentModule = course.modules.find((module) => module.lessons.some((entry) => entry.id === lessonId));
  const progressPercentage = Math.min(
    100,
    Math.round((completedLessons.length / Math.max(flattenCourseLessons(course).length, 1)) * 100),
  );
  const recentActivity: CourseStateRecentActivity[] = [
    {
      id: `${courseId}-${lessonId}-${Date.now()}`,
      courseId,
      lessonId,
      message: `You completed ${lesson.title}`,
      timestamp: now,
      type: "lesson_completed",
    },
    ...existing.recentActivity,
  ];

  if (currentModule && isModuleCompleted(course, currentModule.id, completedLessons)) {
    recentActivity.unshift({
      id: `${courseId}-${lessonId}-module-${Date.now()}`,
      courseId,
      lessonId,
      message: `${currentModule.title} is now complete`,
      timestamp: now,
      type: "module_completed",
    });
  }

  const db = getDb();
  await db.query(
    `INSERT INTO lms_course_progress (
      user_id,
      course_id,
      progress_percentage,
      completed_lessons,
      last_opened_lesson_id,
      xp_earned,
      completion_timestamps,
      recent_activity,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      progress_percentage = VALUES(progress_percentage),
      completed_lessons = VALUES(completed_lessons),
      last_opened_lesson_id = VALUES(last_opened_lesson_id),
      xp_earned = VALUES(xp_earned),
      completion_timestamps = VALUES(completion_timestamps),
      recent_activity = VALUES(recent_activity),
      updated_at = VALUES(updated_at)`,
    [
      userId,
      courseId,
      progressPercentage,
      JSON.stringify(completedLessons),
      lessonId,
      existing.xpEarned + 10,
      JSON.stringify({
        ...existing.completionTimestamps,
        [lessonId]: now,
      }),
      JSON.stringify(recentActivity.slice(0, 12)),
      now,
    ],
  );

  const learnerName = getPortalUser(portalState, userId)?.name ?? "Learner";
  await appendActivity({
    id: `lesson-${courseId}-${lessonId}-${Date.now()}`,
    userId,
    courseId,
    lessonId,
    message: `${learnerName} completed ${lesson.title}.`,
    timestamp: now,
    type: "lesson_completed",
  });

  if (currentModule && isModuleCompleted(course, currentModule.id, completedLessons)) {
    await appendActivity({
      id: `module-${courseId}-${lessonId}-${Date.now()}`,
      userId,
      courseId,
      lessonId,
      message: `${learnerName} mastered ${currentModule.title}.`,
      timestamp: now,
      type: "module_completed",
    });
  }

  if (progressPercentage >= 100) {
    await appendActivity({
      id: `course-complete-${userId}-${courseId}-${Date.now()}`,
      userId,
      courseId,
      message: `${learnerName} completed ${course.title}.`,
      timestamp: now,
      type: "course_completed",
    });

    const certificateExists = portalState.certificates.some(
      (certificate) => certificate.userId === userId && certificate.courseId === courseId,
    );

    if (!certificateExists) {
      await issueCertificate(userId, courseId, now, portalState);
    }
  }

  return {
    ...existing,
    completedLessons,
    lastOpenedLessonId: lessonId,
    progressPercentage,
    xpEarned: existing.xpEarned + 10,
    completionTimestamps: {
      ...existing.completionTimestamps,
      [lessonId]: now,
    },
    recentActivity: recentActivity.slice(0, 12),
  } satisfies LearnerCourseState;
}

export async function submitPaymentProofForEnrollment(userId: string, courseId: string, file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const stored = await saveBufferToUploads(
    "paymentProofDir",
    `${userId}-${courseId}-${Date.now()}-${file.name}`,
    Buffer.from(arrayBuffer),
  );

  const db = getDb();
  const timestamp = new Date().toISOString();
  await db.query(
    `INSERT INTO lms_payment_proofs (user_id, course_id, proof_name, proof_path, mime_type, status, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       proof_name = VALUES(proof_name),
       proof_path = VALUES(proof_path),
       mime_type = VALUES(mime_type),
       status = VALUES(status),
       uploaded_at = VALUES(uploaded_at)`,
    [userId, courseId, file.name, stored.relativePath, file.type, "pending", timestamp],
  );

  await db.query(
    `INSERT INTO lms_enrollments (user_id, course_id, status, reference, submitted_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status), submitted_at = VALUES(submitted_at)`,
    [userId, courseId, "pending_payment", buildPaymentReference(userId, courseId), timestamp],
  );

  const portalState = await buildPortalState();
  const learner = getPortalUser(portalState, userId);
  const course = portalState.courses.find((entry) => entry.id === courseId);
  await appendActivity({
    id: `payment-${userId}-${courseId}-${Date.now()}`,
    userId,
    courseId,
    message: `${learner?.name ?? "Learner"} submitted payment for ${course?.title ?? "course"}.`,
    timestamp,
    type: "payment_submitted",
  });
}

export async function applyEnrollmentDecision(userId: string, courseId: string, decision: "approved" | "rejected") {
  const db = getDb();
  const timestamp = new Date().toISOString();
  await db.query(
    "UPDATE lms_enrollments SET status = ?, reviewed_at = ? WHERE user_id = ? AND course_id = ?",
    [decision, timestamp, userId, courseId],
  );
  await db.query(
    "UPDATE lms_payment_proofs SET status = ? WHERE user_id = ? AND course_id = ?",
    [decision, userId, courseId],
  );

  if (decision === "approved") {
    await db.query(
      `INSERT INTO lms_course_progress (
        user_id,
        course_id,
        progress_percentage,
        completed_lessons,
        last_opened_lesson_id,
        xp_earned,
        completion_timestamps,
        recent_activity,
        updated_at
      ) VALUES (?, ?, 0, ?, NULL, 0, ?, ?, NOW(3))
      ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId, courseId, JSON.stringify([]), JSON.stringify({}), JSON.stringify([])],
    );
  }

  const portalState = await buildPortalState();
  const learner = getPortalUser(portalState, userId);
  const course = portalState.courses.find((entry) => entry.id === courseId);
  const userEmail = learner?.email;

  await appendActivity({
    id: `approval-${userId}-${courseId}-${Date.now()}`,
    userId,
    courseId,
    message:
      decision === "approved"
        ? `${learner?.name ?? "Learner"} was approved for ${course?.title ?? "course"}.`
        : `${learner?.name ?? "Learner"} was rejected for ${course?.title ?? "course"}.`,
    timestamp,
    type: "enrollment_approved",
  });

  if (userEmail) {
    await sendLmsMail({
      to: userEmail,
      subject: `Your enrollment for ${course?.title ?? "course"} was ${decision}`,
      text:
        decision === "approved"
          ? `Your EFT payment was approved and your course access is now active.`
          : `Your EFT payment proof was rejected. Please log in and upload a corrected proof.`,
      html:
        decision === "approved"
          ? `<p>Your EFT payment was approved and your course access is now active.</p>`
          : `<p>Your EFT payment proof was rejected. Please log in and upload a corrected proof.</p>`,
    });
  }
}

export async function createCompanyLearnerAccount(companyId: string, name: string, email: string) {
  const db = getDb();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const learnerId = `company-learner-${Date.now()}`;

  await db.query(
    `INSERT INTO lms_users (id, name, email, password_hash, role, company_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [learnerId, name, email, passwordHash, "student", companyId],
  );

  const courses = await getCourses();
  for (const course of courses) {
    await db.query(
      `INSERT INTO lms_enrollments (user_id, course_id, status, reference, company_id)
       VALUES (?, ?, ?, ?, ?)`,
      [learnerId, course.id, "not_enrolled", buildPaymentReference(learnerId, course.id), companyId],
    );
  }

  return learnerId;
}

export async function createCorporateEnrollmentRequest(companyId: string, courseId: string, learnerIds: string[]) {
  const course = await getCourseByIdFromDb(courseId);
  if (!course || learnerIds.length === 0) {
    throw new Error("Unable to create a corporate request without a course and learners.");
  }

  const requestId = `corp-request-${Date.now()}`;
  const requestedAt = new Date().toISOString();
  const invoiceReference = buildInvoiceReference(companyId, courseId);
  const db = getDb();
  await db.query(
    `INSERT INTO lms_corporate_requests (id, company_id, course_id, learner_ids, invoice_reference, total_amount, status, requested_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      requestId,
      companyId,
      courseId,
      JSON.stringify(learnerIds),
      invoiceReference,
      course.price * learnerIds.length,
      "pending_invoice",
      requestedAt,
    ],
  );

  for (const learnerId of learnerIds) {
    await db.query(
      `INSERT INTO lms_enrollments (user_id, course_id, status, reference, company_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE reference = VALUES(reference), company_id = VALUES(company_id)`,
      [learnerId, courseId, "not_enrolled", invoiceReference, companyId],
    );
  }

  const portalState = await buildPortalState();
  const company = portalState.companies.find((entry) => entry.id === companyId);
  await appendActivity({
    id: `corp-request-${requestId}`,
    userId: learnerIds[0] ?? companyId,
    companyId,
    courseId,
    message: `${company?.name ?? "Company"} requested enrollment for ${course.title}.`,
    timestamp: requestedAt,
    type: "corporate_request",
  });
}

export async function applyCorporateRequestDecision(requestId: string, decision: "active" | "rejected") {
  const db = getDb();
  const timestamp = new Date().toISOString();
  const { rows } = await db.query<{
    company_id: string;
    course_id: string;
    learner_ids: unknown;
    invoice_reference: string;
  }>(
    "SELECT company_id, course_id, learner_ids, invoice_reference FROM lms_corporate_requests WHERE id = ? LIMIT 1",
    [requestId],
  );
  const request = rows[0]
    ? {
        ...rows[0],
        learner_ids: parseJsonValue<string[]>(rows[0].learner_ids, []),
      }
    : null;

  if (!request) {
    throw new Error("Corporate request not found.");
  }

  await db.query(
    "UPDATE lms_corporate_requests SET status = ?, reviewed_at = ? WHERE id = ?",
    [decision, timestamp, requestId],
  );

  for (const learnerId of request.learner_ids) {
    await db.query(
      `INSERT INTO lms_enrollments (user_id, course_id, status, reference, company_id, reviewed_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         status = VALUES(status),
         reference = VALUES(reference),
         company_id = VALUES(company_id),
         reviewed_at = VALUES(reviewed_at)`,
      [
        learnerId,
        request.course_id,
        decision === "active" ? "approved" : "rejected",
        request.invoice_reference,
        request.company_id,
        timestamp,
      ],
    );
  }

  const portalState = await buildPortalState();
  const company = portalState.companies.find((entry) => entry.id === request.company_id);
  const course = portalState.courses.find((entry) => entry.id === request.course_id);
  await appendActivity({
    id: `corp-request-decision-${requestId}-${Date.now()}`,
    userId: request.learner_ids[0] ?? request.company_id,
    companyId: request.company_id,
    courseId: request.course_id,
    message:
      decision === "active"
        ? `${company?.name ?? "Company"} received learner access for ${course?.title ?? "course"}.`
        : `${company?.name ?? "Company"} request for ${course?.title ?? "course"} was rejected.`,
    timestamp,
    type: "corporate_request_approved",
  });
}

export async function readStoredUpload(relativePath: string) {
  const env = getAppEnv();
  const cleaned = relativePath.replace(/^\/+/, "");
  const uploadRoot = path.resolve(/* turbopackIgnore: true */ process.cwd(), env.uploadRoot);
  const absolutePath = path.resolve(uploadRoot, cleaned);

  if (!absolutePath.startsWith(uploadRoot)) {
    throw new Error("Invalid upload path.");
  }

  return {
    buffer: await readFile(absolutePath),
    absolutePath,
  };
}

export async function buildReportingRows(
  filters?: {
    companyId?: string;
    courseId?: string;
    completionStatus?: CompletionFilter;
  },
) {
  const portalState = await buildPortalState();
  const rows: ReportingRow[] = portalState.enrollments
    .filter((enrollment) => enrollment.status !== "not_enrolled")
    .map((enrollment) => {
      const learner = portalState.users.find((user) => user.id === enrollment.userId);
      const course = portalState.courses.find((entry) => entry.id === enrollment.courseId);
      const courseState = portalState.courseStates.find(
        (entry) => entry.userId === enrollment.userId && entry.courseId === enrollment.courseId,
      );
      const company =
        portalState.companies.find((entry) => entry.id === enrollment.companyId) ??
        portalState.companies.find((entry) => entry.id === learner?.companyId);
      const progress = courseState?.progressPercentage ?? 0;

      return {
        id: `${enrollment.userId}-${enrollment.courseId}`,
        learnerId: learner?.id ?? enrollment.userId,
        learnerName: learner?.name ?? "Learner",
        companyId: company?.id,
        companyName: company?.name,
        courseId: course?.id ?? enrollment.courseId,
        courseTitle: course?.title ?? "Course",
        progressPercentage: progress,
        status: progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started",
        enrollmentStatus: company && enrollment.status === "approved" ? "active" : enrollment.status,
        hasCertificate: portalState.certificates.some(
          (certificate) => certificate.userId === enrollment.userId && certificate.courseId === enrollment.courseId,
        ),
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

  const summary: ReportingSummary = {
    totalLearners: new Set(rows.map((row) => row.learnerId)).size,
    activeLearners: new Set(rows.filter((row) => row.progressPercentage > 0).map((row) => row.learnerId)).size,
    completedCourses: rows.filter((row) => row.status === "completed").length,
    certificatesIssued: rows.filter((row) => row.hasCertificate).length,
    revenue: rows
      .filter((row) => row.enrollmentStatus === "approved" || row.enrollmentStatus === "active")
      .reduce((sum, row) => {
        const course = portalState.courses.find((entry) => entry.id === row.courseId);
        return sum + (course?.price ?? 0);
      }, 0),
    pendingPayments: portalState.paymentProofs.filter((proof) => proof.status === "pending").length,
    approvedPayments: portalState.paymentProofs.filter((proof) => proof.status === "approved").length,
  };

  return { rows, summary, csv: exportReportingRowsToCsv(rows) };
}
