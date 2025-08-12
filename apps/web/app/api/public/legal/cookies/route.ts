import { NextResponse } from 'next/server'

export async function GET() {
  const cookiesData = {
    title: "Cookie Policy",
    lastUpdated: "January 15, 2025",
    sections: [
      {
        id: 1,
        title: "What Are Cookies?",
        icon: "Shield",
        content: [
          "Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.",
          "Cookies can be set by us (first-party cookies) or by third-party services we use (third-party cookies)."
        ]
      },
      {
        id: 2,
        title: "Types of Cookies We Use",
        content: [
          {
            essential: {
              title: "Essential Cookies",
              description: "These cookies are necessary for the website to function properly. They enable basic functions like:",
              items: [
                "User authentication and login sessions",
                "Security features and fraud prevention",
                "Basic website functionality",
                "Remembering your language preferences"
              ],
              note: "These cookies cannot be disabled as they are essential for the website to work."
            },
            analytics: {
              title: "Analytics Cookies",
              description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously:",
              items: [
                "Pages visited and time spent on each page",
                "Navigation patterns and user journeys",
                "Performance and error monitoring",
                "Feature usage and popularity"
              ],
              note: "This information helps us improve our platform and user experience."
            },
            preference: {
              title: "Preference Cookies",
              description: "These cookies remember your choices and preferences to provide a personalized experience:",
              items: [
                "Theme and appearance settings",
                "Code analysis preferences",
                "Development environment settings",
                "Notification settings"
              ]
            },
            marketing: {
              title: "Marketing Cookies",
              description: "These cookies are used to deliver relevant advertisements and track marketing campaign performance:",
              items: [
                "Ad personalization and targeting",
                "Campaign effectiveness measurement",
                "Cross-site tracking for advertising",
                "Social media integration"
              ],
              note: "These cookies are only set with your explicit consent."
            }
          }
        ]
      },
      {
        id: 3,
        title: "Third-Party Cookies",
        content: [
          "We use third-party services that may set their own cookies on your device. These services help us provide better functionality and user experience.",
          {
            analytics: {
              title: "Analytics Services",
              items: [
                "Google Analytics - Website usage analytics",
                "Mixpanel - User behavior tracking",
                "Hotjar - User experience research"
              ]
            },
            payment: {
              title: "Payment Processors",
              items: [
                "Stripe - Payment processing",
                "PayPal - Alternative payment method"
              ]
            },
            social: {
              title: "Social Media",
              items: [
                "Facebook - Social sharing and login",
                "Google - Authentication and sharing",
                "Twitter - Social sharing"
              ]
            }
          },
          "Each third-party service has its own privacy policy and cookie practices. We recommend reviewing their policies for more information."
        ]
      },
      {
        id: 4,
        title: "Managing Your Cookie Preferences",
        content: [
          "You have several options for managing cookies:",
          {
            browser: {
              title: "Browser Settings",
              description: "Most web browsers allow you to control cookies through their settings. You can:",
              items: [
                "Block all cookies",
                "Allow only first-party cookies",
                "Delete existing cookies",
                "Set preferences for specific websites"
              ],
              note: "Note: Disabling certain cookies may affect website functionality."
            },
            consent: {
              title: "Cookie Consent",
              description: "When you first visit our website, you'll see a cookie consent banner that allows you to:",
              items: [
                "Accept all cookies",
                "Customize your preferences",
                "Reject non-essential cookies"
              ]
            },
            optOut: {
              title: "Opt-Out Tools",
              description: "You can also use industry opt-out tools:",
              items: [
                "Digital Advertising Alliance (DAA) opt-out",
                "Network Advertising Initiative (NAI) opt-out",
                "European Interactive Digital Advertising Alliance (EDAA) opt-out"
              ]
            }
          }
        ]
      },
      {
        id: 5,
        title: "Contact Us",
        content: [
          "If you have any questions about our use of cookies or this Cookie Policy, please contact us:",
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

  return NextResponse.json(cookiesData)
} 