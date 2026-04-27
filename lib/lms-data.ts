export type LessonType = "video" | "pdf" | "text";

export type Lesson = {
  id: string;
  title: string;
  type: LessonType;
  contentUrl: string;
  duration: string;
  summary: string;
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  modules: Module[];
  media: string[];
};

export type CourseProgress = {
  userId: string;
  courseId: string;
  completedLessons: string[];
  progressPercentage: number;
  updatedAt: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  role: "student" | "company_admin";
  companyId?: string;
  enrolledCourseIds: string[];
};

export const lmsCourses: Course[] = [
  {
    id: "digital-work-readiness",
    title: "Digital Work Readiness",
    description:
      "A modern onboarding pathway that equips learners with digital communication, remote collaboration, and workplace productivity skills.",
    category: "Workplace Skills",
    level: "Beginner",
    price: 1800,
    media: ["/programs/24.jpg"],
    modules: [
      {
        id: "dwr-module-1",
        title: "Professional Foundations",
        lessons: [
          {
            id: "dwr-lesson-1",
            title: "Welcome to the Programme",
            type: "video",
            contentUrl: "https://example.com/lms/dwr/welcome",
            duration: "08 min",
            summary: "Course orientation, success outcomes, and how to navigate the learning portal.",
          },
          {
            id: "dwr-lesson-2",
            title: "Communication in Modern Teams",
            type: "text",
            contentUrl: "https://example.com/lms/dwr/communication",
            duration: "12 min",
            summary: "Core workplace communication practices for digital-first teams and structured reporting.",
          },
        ],
      },
      {
        id: "dwr-module-2",
        title: "Productivity and Delivery",
        lessons: [
          {
            id: "dwr-lesson-3",
            title: "Planning Your Work Week",
            type: "pdf",
            contentUrl: "https://example.com/lms/dwr/planning-guide.pdf",
            duration: "15 min",
            summary: "A planner-based workflow for managing deadlines, tasks, and daily priorities.",
          },
        ],
      },
    ],
  },
  {
    id: "customer-service-excellence",
    title: "Customer Service Excellence",
    description:
      "A practical service-delivery course built to improve customer experience, issue resolution, and service confidence.",
    category: "Service Delivery",
    level: "Intermediate",
    price: 2200,
    media: ["/programs/21.jpg"],
    modules: [
      {
        id: "cse-module-1",
        title: "Service Mindset",
        lessons: [
          {
            id: "cse-lesson-1",
            title: "Understanding Customer Expectations",
            type: "video",
            contentUrl: "https://example.com/lms/cse/expectations",
            duration: "11 min",
            summary: "How to map expectations and deliver more consistent service interactions.",
          },
          {
            id: "cse-lesson-2",
            title: "Handling Difficult Scenarios",
            type: "pdf",
            contentUrl: "https://example.com/lms/cse/escalations.pdf",
            duration: "14 min",
            summary: "A framework for escalation handling, de-escalation, and solution-based responses.",
          },
        ],
      },
    ],
  },
  {
    id: "project-delivery-fundamentals",
    title: "Project Delivery Fundamentals",
    description:
      "An applied learning path for learners and junior coordinators managing tasks, timelines, and delivery milestones.",
    category: "Project Management",
    level: "Intermediate",
    price: 2500,
    media: ["/programs/22.jpg"],
    modules: [
      {
        id: "pdf-module-1",
        title: "Project Foundations",
        lessons: [
          {
            id: "pdf-lesson-1",
            title: "Project Scope and Goals",
            type: "text",
            contentUrl: "https://example.com/lms/pdf/scope-goals",
            duration: "10 min",
            summary: "An introduction to defining project outcomes, boundaries, and success measures.",
          },
          {
            id: "pdf-lesson-2",
            title: "Tracking Delivery Progress",
            type: "video",
            contentUrl: "https://example.com/lms/pdf/tracking-progress",
            duration: "09 min",
            summary: "How to use milestones, task owners, and reporting rhythms to keep delivery on track.",
          },
        ],
      },
    ],
  },
];

export const lmsStudents: StudentProfile[] = [
  {
    id: "student-001",
    name: "Naledi Mokoena",
    email: "naledi@example.com",
    role: "student",
    enrolledCourseIds: ["digital-work-readiness", "customer-service-excellence"],
  },
  {
    id: "student-002",
    name: "Ayanda Ndlovu",
    email: "ayanda@example.com",
    role: "student",
    enrolledCourseIds: ["project-delivery-fundamentals"],
  },
  {
    id: "company-admin-001",
    name: "Karabo Dlamini",
    email: "karabo@ubuntuoperations.co.za",
    role: "company_admin",
    companyId: "company-001",
    enrolledCourseIds: [],
  },
  {
    id: "company-learner-001",
    name: "Lebo Mthembu",
    email: "lebo@ubuntuoperations.co.za",
    role: "student",
    companyId: "company-001",
    enrolledCourseIds: [],
  },
  {
    id: "company-learner-002",
    name: "Refilwe Khosa",
    email: "refilwe@ubuntuoperations.co.za",
    role: "student",
    companyId: "company-001",
    enrolledCourseIds: [],
  },
];

export const lmsProgressSeed: CourseProgress[] = [
  {
    userId: "student-001",
    courseId: "digital-work-readiness",
    completedLessons: ["dwr-lesson-1"],
    progressPercentage: 33,
    updatedAt: "2026-04-27T08:00:00.000Z",
  },
  {
    userId: "student-001",
    courseId: "customer-service-excellence",
    completedLessons: ["cse-lesson-1", "cse-lesson-2"],
    progressPercentage: 100,
    updatedAt: "2026-04-25T14:30:00.000Z",
  },
  {
    userId: "student-002",
    courseId: "project-delivery-fundamentals",
    completedLessons: ["pdf-lesson-1"],
    progressPercentage: 50,
    updatedAt: "2026-04-26T09:15:00.000Z",
  },
];

export const defaultStudentId = "student-001";

export function getCourseById(courseId: string) {
  return lmsCourses.find((course) => course.id === courseId);
}

export function getStudentById(studentId: string) {
  return lmsStudents.find((student) => student.id === studentId);
}

export function getProgressForUser(userId: string) {
  return lmsProgressSeed.filter((entry) => entry.userId === userId);
}

export function getLessonCount(course: Course) {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}
