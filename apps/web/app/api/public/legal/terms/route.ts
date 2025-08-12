import { NextResponse } from 'next/server'

export async function GET() {
  const termsData = {
    title: "Terms of Service",
    lastUpdated: "January 15, 2025",
    sections: [
      {
        id: 1,
        title: "Introduction",
        icon: "Shield",
        content: [
          "Welcome to B.A.B.Y. (\"we,\" \"our,\" or \"us\"). These Terms of Service (\"Terms\") govern your use of our AI-powered code analysis and development platform, including our website, mobile applications, and related services (collectively, the \"Service\").",
          "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service."
        ]
      },
      {
        id: 2,
        title: "Service Description",
        content: [
          "B.A.B.Y. provides a platform for developers and development teams to:",
          [
            "Analyze and understand code structure",
            "Generate flow diagrams and visualizations",
            "Optimize code performance and quality",
            "Collaborate on code reviews and analysis",
            "Integrate AI-powered development tools"
          ],
          "We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice."
        ]
      },
      {
        id: 3,
        title: "User Accounts",
        content: [
          "To use certain features of the Service, you must create an account. You are responsible for:",
          [
            "Providing accurate and complete information",
            "Maintaining the security of your account credentials",
            "All activities that occur under your account",
            "Notifying us immediately of any unauthorized use"
          ],
          "You must be at least 18 years old to create an account. If you are under 18, you may only use the Service with the involvement of a parent or guardian."
        ]
      },
      {
        id: 4,
        title: "Acceptable Use",
        content: [
          "You agree not to use the Service to:",
          [
            "Violate any applicable laws or regulations",
            "Infringe on the rights of others",
            "Upload or share harmful, offensive, or inappropriate content",
            "Attempt to gain unauthorized access to our systems",
            "Interfere with the proper functioning of the Service",
            "Use the Service for commercial purposes without permission"
          ]
        ]
      },
      {
        id: 5,
        title: "Privacy and Data Protection",
        content: [
          "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.",
          "By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.",
          "We implement appropriate security measures to protect your data, but no method of transmission over the internet is 100% secure."
        ]
      },
      {
        id: 6,
        title: "Intellectual Property",
        content: [
          "The Service and its original content, features, and functionality are owned by B.A.B.Y. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.",
          "You retain ownership of any content you submit to the Service, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content in connection with the Service."
        ]
      },
      {
        id: 7,
        title: "Payment Terms",
        content: [
          "Some features of the Service may require payment. All payments are processed securely through third-party payment processors.",
          "Subscription fees are billed in advance on a recurring basis. You may cancel your subscription at any time, but no refunds will be provided for partial billing periods.",
          "We reserve the right to change our pricing with 30 days' notice to existing customers."
        ]
      },
      {
        id: 8,
        title: "Limitation of Liability",
        content: [
          "To the maximum extent permitted by law, B.A.B.Y. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
          "Our total liability to you for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim."
        ]
      },
      {
        id: 9,
        title: "Termination",
        content: [
          "You may terminate your account at any time by contacting us or using the account deletion feature in your settings.",
          "We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.",
          "Upon termination, your right to use the Service will cease immediately, and we may delete your account and data."
        ]
      },
      {
        id: 10,
        title: "Contact Us",
        content: [
          "If you have any questions about these Terms of Service, please contact us:",
          {
            email: "legal@baby.dev",
            address: "123 Innovation Drive, San Francisco, CA 94105",
            phone: "+1 (555) 123-4567"
          },
          "We will respond to your inquiry within 30 days of receipt."
        ]
      }
    ]
  }

  return NextResponse.json(termsData)
} 