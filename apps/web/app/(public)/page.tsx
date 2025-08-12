"use client"

import IntroductionSection from "@/components/install/IntroductionSection"
import GifPreviewSection from "@/components/install/GifPreviewSection"
import QuickStartSection from "@/components/install/QuickStartSection"
import InstallOptionsSection from "@/components/install/InstallOptionsSection"
import CtaSection from "@/components/install/CtaSection"

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-background">
      <IntroductionSection />
      <GifPreviewSection />
      <QuickStartSection />
      <InstallOptionsSection />
      <CtaSection />
    </div>
  )
}
