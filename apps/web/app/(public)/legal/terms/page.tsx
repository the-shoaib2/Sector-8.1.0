"use client"

import { useLegalData } from "@/hooks/use-legal-data"
import { LegalContentRenderer } from "@/components/legal-content-renderer"

export default function TermsOfServicePage() {
  const { data, isLoading } = useLegalData('terms')

  return <LegalContentRenderer data={data} type="terms" isLoading={isLoading} />
} 