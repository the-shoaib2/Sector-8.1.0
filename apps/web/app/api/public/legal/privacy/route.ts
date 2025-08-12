import { NextResponse } from 'next/server'

export async function GET() {
  const privacyData = {
    title: "Privacy Policy",
    lastUpdated: "January 15, 2025",
    sections: [
      {
        id: 1,
        title: "Introduction",
        icon: "Shield",
        content: [
          "B.A.B.Y. (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered code analysis and development platform.",
          "By using our service, you consent to the data practices described in this policy."
        ]
      },
      {
        id: 2,
        title: "Information We Collect",
        content: [
          "We collect several types of information from and about users of our platform:",
          {
            personalInfo: [
              "Name and email address",
              "Profile information and preferences",
              "Payment information (processed securely by third parties)",
              "Communication preferences"
            ],
            usageInfo: [
              "Code files and analysis data you upload",
              "Flow diagrams and optimization suggestions",
              "Development environment and tool preferences",
              "App usage patterns and preferences"
            ],
            technicalInfo: [
              "Device information and IP addresses",
              "Browser type and version",
              "Operating system",
              "Usage analytics and performance data"
            ]
          }
        ]
      },
      {
        id: 3,
        title: "How We Use Your Information",
        content: [
          "We use the information we collect to:",
          [
            "Provide and maintain our code analysis services",
            "Process payments and manage subscriptions",
            "Enable collaboration between developers and team members",
            "Personalize your experience and provide relevant content",
            "Improve our platform and develop new features",
            "Ensure security and prevent fraud",
            "Comply with legal obligations"
          ]
        ]
      },
      {
        id: 4,
        title: "Information Sharing and Disclosure",
        content: [
          "We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:",
          {
            withConsent: "We may share information when you explicitly consent to such sharing.",
            groupCollaboration: "Information you share within teams (code analysis, flow diagrams, etc.) is visible to other team members.",
            serviceProviders: "We may share information with trusted third-party service providers who assist us in operating our platform.",
            legalRequirements: "We may disclose information if required by law or to protect our rights and safety."
          }
        ]
      },
      {
        id: 5,
        title: "Data Security",
        content: [
          "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
          "Our security measures include:",
          [
            "Encryption of data in transit and at rest",
            "Regular security assessments and updates",
            "Access controls and authentication",
            "Secure data centers and infrastructure",
            "Employee training on data protection"
          ],
          "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
        ]
      },
      {
        id: 6,
        title: "Data Retention",
        content: [
          "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.",
          "When you delete your account, we will delete or anonymize your personal information, except where we need to retain certain information for legal, regulatory, or legitimate business purposes."
        ]
      },
      {
        id: 7,
        title: "Your Rights and Choices",
        content: [
          "You have the following rights regarding your personal information:",
          [
            "Access: Request a copy of your personal information",
            "Correction: Update or correct inaccurate information",
            "Deletion: Request deletion of your personal information",
            "Portability: Request transfer of your data to another service",
            "Objection: Object to certain processing activities",
            "Restriction: Request limitation of processing"
          ],
          "To exercise these rights, please contact us using the information provided at the end of this policy."
        ]
      },
      {
        id: 8,
        title: "Contact Us",
        content: [
          "If you have any questions about this Privacy Policy or our data practices, please contact us:",
          {
            email: "privacy@baby.dev",
            address: "123 Innovation Drive, San Francisco, CA 94105",
            phone: "+1 (555) 123-4567"
          },
          "We will respond to your inquiry within 30 days of receipt."
        ]
      }
    ]
  }

  return NextResponse.json(privacyData)
} 