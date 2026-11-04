"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { getStoredProfile } from "@/lib/auth/profile";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const HomeHeader = () => {
  const profile = getStoredProfile();
  const name = profile?.displayName ?? "Guest";

  return (
    <header className="flex items-start justify-between px-6 pt-12 pb-6">
      <div className="flex items-center gap-3">
        <Image src="/images/leaf.png" alt="NeuroSnap" width={30} height={30} className="rounded-full" />
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900">
            {getGreeting()}, {name}
          </h1>
          <p className="mt-1 text-[12px] text-zinc-500">
            Let's keep your nutrition on track.
          </p>
        </div>
      </div>

      <button className="relative mt-1 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md">
        <Bell size={22} className="text-zinc-800" strokeWidth={1.8} />
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
      </button>
    </header>
  );
};

export default HomeHeader;