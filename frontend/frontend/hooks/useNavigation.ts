"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, BookOpen, Camera, BarChart3, User, LucideIcon } from "lucide-react";

export type TabName = "Home" | "Journal" | "Scan" | "Reports" | "Profile";

export interface Tab {
  name: TabName;
  path: string;
  icon: LucideIcon;
  label: string;
}

const tabs: Tab[] = [
  { name: "Home", path: "/", icon: Home, label: "Home" },
  { name: "Journal", path: "/journal", icon: BookOpen, label: "Journal" },
  { name: "Scan", path: "/vision-ai", icon: Camera, label: "Scan" },
  { name: "Reports", path: "/reports", icon: BarChart3, label: "Reports" },
  { name: "Profile", path: "/profile", icon: User, label: "Profile" },
];

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = (): TabName => {
    const currentTab = tabs.find((tab) => tab.path === pathname);
    return currentTab?.name ?? "Home";
  };

  const navigateTo = (tab: TabName) => {
    const selectedTab = tabs.find((t) => t.name === tab);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  const isActive = (tabName: TabName): boolean => {
    return getActiveTab() === tabName;
  };

  return {
    tabs,
    activeTab: getActiveTab(),
    getActiveTab,
    navigateTo,
    isActive,
  };
}