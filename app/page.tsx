"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppData } from "@/hooks/useAppData";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";

export default function RootPage() {
  const { hasProfile } = useAppData();
  const router = useRouter();

  useEffect(() => {
    if (hasProfile) {
      router.replace("/dashboard");
    }
  }, [hasProfile, router]);

  if (hasProfile) {
    return <div className="min-h-dvh bg-bg" />;
  }

  return <OnboardingScreen />;
}
