"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7FBF9] via-[#EAF7F1] to-[#DFF3EA]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 h-16 w-16 rounded-full bg-emerald-400/20 animate-emerald-pulse" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <OnboardingForm />;
}