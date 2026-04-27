import Link from "next/link";
import type { ReactNode } from "react";

type LmsShellProps = {
  title: string;
  description: string;
  role: "student" | "admin" | "company_admin";
  children: ReactNode;
};

const navByRole = {
  student: [
    { href: "/lms/student", label: "Dashboard" },
    { href: "/lms/student/courses", label: "My Courses" },
  ],
  admin: [
    { href: "/lms/admin", label: "Management Panel" },
    { href: "/lms/student", label: "Student View" },
  ],
  company_admin: [
    { href: "/lms/company", label: "Company Dashboard" },
    { href: "/lms/student/courses", label: "Course Library" },
  ],
};

export function LmsShell({ title, description, role, children }: LmsShellProps) {
  return (
    <section className="bg-mist/70">
      <div className="section-shell section-space">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
          <div className="border-b border-line bg-gradient-to-r from-navy to-[#14305d] px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="eyebrow border-white/20 bg-white/10 text-white">
                  {role === "student" ? "Student Portal" : role === "admin" ? "Admin Portal" : "Company Portal"}
                </span>
                <div className="space-y-2">
                  <h1 className="font-sans text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                  <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {navByRole[role].map((item) => (
                  <Link key={item.href} href={item.href} className="btn-secondary-light">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
