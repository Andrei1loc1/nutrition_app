"use client";

import { LucideIcon, Camera } from "lucide-react";
import { useNavigation, Tab } from "@/hooks/useNavigation";
import Image from "next/image"

function NavItem({
  tab,
  isActive,
  onClick,
}: {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = tab.icon as LucideIcon;
  const activeColor = "var(--color-primary-600)";
  const inactiveColor = "var(--color-gray-400)";
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-105"
      aria-label={tab.label}
    >
      <span style={{ color: isActive ? activeColor : inactiveColor }}>
        <Icon size={20} />
      </span>
      <span style={{ color: isActive ? activeColor : inactiveColor, fontSize: "11px", fontWeight: 600 }}>
        {tab.label}
      </span>
    </button>
  );
}

function FloatingScanButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="absolute left-1/2 -top-8 -translate-x-1/2">
            <button
                onClick={onClick}
                aria-label="Scan"
                className="relative h-[80px] w-[80px] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
                <Image
                    src="/images/icon_camera.png"
                    alt="Scan"
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                />
            </button>
        </div>
    );
}

export default function Navbar() {
  const { tabs, navigateTo, isActive } = useNavigation();

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(3);

  return (
      <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 px-4">
        <div
            className="relative flex w-full items-center justify-between border border-white bg-white/60 px-5 py-3 backdrop-blur-xl"
            style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)" }}
        >
        <div className="flex items-center gap-6">
          {leftTabs.map((tab) => (
            <NavItem
              key={tab.name}
              tab={tab}
              isActive={isActive(tab.name)}
              onClick={() => navigateTo(tab.name)}
            />
          ))}
        </div>

        <div className="flex items-center gap-8">
          {rightTabs.map((tab) => (
            <NavItem
              key={tab.name}
              tab={tab}
              isActive={isActive(tab.name)}
              onClick={() => navigateTo(tab.name)}
            />
          ))}
        </div>

        <FloatingScanButton onClick={() => navigateTo("Scan")} />
      </div>
    </div>
  );
}