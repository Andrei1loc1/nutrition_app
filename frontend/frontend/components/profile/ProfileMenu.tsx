"use client";

import { useRouter } from "next/navigation";
import { User, Target, Bell, LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const navItems = [
  { label: "Personal Info", icon: User, href: "/profile/edit" },
  { label: "Nutrition Goals", icon: Target, href: "/profile/goals" },
];

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <div className="h-7 w-12 rounded-full bg-zinc-200 transition-colors peer-checked:bg-emerald-500" />
      <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
    </label>
  );
}

export default function ProfileMenu() {
  const { logout } = useUser();
  const router = useRouter();
  const { enabled, toggle } = useNotificationSettings();

  async function handleLogout() {
    await logout();
    router.push("/onboarding");
  }

  return (
    <div className="mx-6 mt-4 mb-12 rounded-[28px] border border-white bg-white/20 p-4 shadow-[0_20px_60px_rgba(20,83,45,0.08)] backdrop-blur-xl">
      <div className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex w-full items-center gap-4 rounded-2xl p-4 text-zinc-600 transition-colors hover:bg-white/60"
          >
            <div className="rounded-xl bg-zinc-100 p-2">
              <item.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        ))}

        <div className="flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-zinc-600">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-zinc-100 p-2">
              <Bell className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Notifications</span>
          </div>
          <ToggleSwitch enabled={enabled} onChange={toggle} />
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-2xl p-4 text-red-500 transition-colors hover:bg-red-50"
        >
          <div className="rounded-xl bg-red-100 p-2">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}
