"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { getStoredProfile } from "@/lib/auth/profile";

export default function ProfileHeader() {
  const router = useRouter();
  const { user } = useUser();
  const profile = getStoredProfile();

  const displayName = profile?.displayName ?? user?.displayName ?? "Guest";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative mx-6 mt-6 flex items-center gap-5 rounded-[28px] border border-white bg-white/20 p-6 shadow-[0_20px_60px_rgba(20,83,45,0.08)] backdrop-blur-xl">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-inner bg-emerald-100 flex items-center justify-center">
        {profile?.displayName ? (
          <span className="text-2xl font-bold text-emerald-700">{initials}</span>
        ) : (
          <Image
            src="/images/pizza.jpg"
            alt="User avatar"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 truncate">
          {displayName}
        </h2>
        <p className="text-sm font-medium text-zinc-500 truncate capitalize">
          {profile?.goal?.replace(/_/g, " ") ?? "Set your goals"}
        </p>
      </div>
      <button
        onClick={() => router.push("/profile/edit")}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 border border-white/80 text-zinc-600 hover:bg-white transition-colors shadow-sm"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}