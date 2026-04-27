"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LmsPortalState, getCompanyById, getCompanyOverview } from "@/lib/lms-store";

type PortalRole = "student" | "company_admin" | "admin";

async function fetchPortal(role: PortalRole) {
  const endpoint =
    role === "student"
      ? "/api/lms/student/portal"
      : role === "company_admin"
        ? "/api/lms/company/portal"
        : "/api/lms/admin/portal";

  const response = await fetch(endpoint, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load LMS portal data.");
  }

  const payload = (await response.json()) as { portalState: LmsPortalState };
  return payload.portalState;
}

function usePortal(role: PortalRole) {
  const [portalState, setPortalState] = useState<LmsPortalState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const next = await fetchPortal(role);
      setPortalState(next);
      return next;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load LMS data.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  return {
    hydrated: true,
    loading,
    error,
    portalState,
    refresh,
  };
}

export function useStudentPortal(userId: string) {
  const portal = usePortal("student");
  const enrollments = useMemo(
    () => portal.portalState?.enrollments.filter((entry) => entry.userId === userId) ?? [],
    [portal.portalState, userId],
  );
  const approvedCourses = useMemo(
    () =>
      portal.portalState?.courses.filter((course) =>
        enrollments.some((enrollment) => enrollment.courseId === course.id && enrollment.status === "approved"),
      ) ?? [],
    [enrollments, portal.portalState],
  );

  const submitPaymentProof = useCallback(
    async (courseId: string, file: File) => {
      const formData = new FormData();
      formData.set("courseId", courseId);
      formData.set("file", file);

      const response = await fetch("/api/lms/student/payment-proof", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to submit payment proof.");
      }

      await portal.refresh();
    },
    [portal],
  );

  const setLastOpenedLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      await fetch("/api/lms/student/progress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "open",
          courseId,
          lessonId,
        }),
      });

      await portal.refresh();
    },
    [portal],
  );

  const completeLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      const response = await fetch("/api/lms/student/progress", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "complete",
          courseId,
          lessonId,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save lesson completion.");
      }

      await portal.refresh();
    },
    [portal],
  );

  return {
    ...portal,
    portalState: portal.portalState,
    enrollments,
    approvedCourses,
    submitPaymentProof,
    setLastOpenedLesson,
    completeLesson,
  };
}

export function useCompanyPortal(companyId: string) {
  const portal = usePortal("company_admin");

  const company = useMemo(
    () => (portal.portalState ? getCompanyById(portal.portalState, companyId) : null),
    [companyId, portal.portalState],
  );
  const overview = useMemo(
    () =>
      portal.portalState
        ? getCompanyOverview(companyId, portal.portalState)
        : {
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
            },
          },
    [companyId, portal.portalState],
  );
  const requests = useMemo(
    () => portal.portalState?.corporateRequests.filter((entry) => entry.companyId === companyId) ?? [],
    [companyId, portal.portalState],
  );

  const addLearner = useCallback(
    async (name: string, email: string) => {
      const response = await fetch("/api/lms/company/learners", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows: [{ name, email }] }),
      });

      if (!response.ok) {
        throw new Error("Unable to add learner.");
      }

      await portal.refresh();
    },
    [portal],
  );

  const importLearners = useCallback(
    async (rows: Array<{ name: string; email: string }>) => {
      const response = await fetch("/api/lms/company/learners", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rows }),
      });

      if (!response.ok) {
        throw new Error("Unable to import learners.");
      }

      await portal.refresh();
    },
    [portal],
  );

  const requestEnrollment = useCallback(
    async (courseId: string, learnerIds: string[]) => {
      const response = await fetch("/api/lms/company/enrollment-requests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, learnerIds }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit enrollment request.");
      }

      await portal.refresh();
    },
    [portal],
  );

  return {
    ...portal,
    company,
    overview,
    requests,
    addLearner,
    importLearners,
    requestEnrollment,
  };
}

export function useAdminPortal() {
  const portal = usePortal("admin");

  const approveEnrollment = useCallback(
    async (userId: string, courseId: string) => {
      await fetch("/api/lms/admin/enrollments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
          decision: "approved",
        }),
      });
      await portal.refresh();
    },
    [portal],
  );

  const rejectEnrollment = useCallback(
    async (userId: string, courseId: string) => {
      await fetch("/api/lms/admin/enrollments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          courseId,
          decision: "rejected",
        }),
      });
      await portal.refresh();
    },
    [portal],
  );

  const approveCorporateRequest = useCallback(
    async (requestId: string) => {
      await fetch("/api/lms/admin/corporate-requests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          decision: "active",
        }),
      });
      await portal.refresh();
    },
    [portal],
  );

  const rejectCorporateRequest = useCallback(
    async (requestId: string) => {
      await fetch("/api/lms/admin/corporate-requests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          decision: "rejected",
        }),
      });
      await portal.refresh();
    },
    [portal],
  );

  return {
    ...portal,
    approveEnrollment,
    rejectEnrollment,
    approveCorporateRequest,
    rejectCorporateRequest,
  };
}
