"use client"

import { useLegalData } from "@/hooks/use-legal-data"
import { LegalContentRenderer } from "@/components/legal-content-renderer"

export default function PrivacyPolicyPage() {
  const { data, isLoading } = useLegalData('privacy')

  return <LegalContentRenderer data={data} type="privacy" isLoading={isLoading} />
} 