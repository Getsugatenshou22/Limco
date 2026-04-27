"use client";

import { Trophy } from "lucide-react";

type AchievementToastProps = {
  open: boolean;
  title: string;
  description: string;
};

export function AchievementToast({ open, title, description }: AchievementToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-2rem))] transition-all duration-300 ease-out ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_24px_60px_-30px_rgba(11,31,59,0.45)]">
        <div className="flex items-start gap-4 bg-gradient-to-r from-navy to-[#14305d] px-5 py-4 text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-gold">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm leading-6 text-white/78">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
