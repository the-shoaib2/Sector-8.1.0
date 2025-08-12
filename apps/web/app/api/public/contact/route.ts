import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate API delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 400))

    const contactData = {
      hero: {
        title: "We'd Love to Hear from You",
        subtitle: "Have questions, feedback, or need help? Our team is here to support you. Reach out and we'll get back to you as soon as possible."
      },
      contactMethods: [
        {
          title: "Email Support",
          description: "Get help via email within 24 hours",
          contact: "support@baby.dev",
          icon: "Mail"
        },
        {
          title: "Phone Support",
          description: "Speak with our team directly",
          contact: "+1 (555) 123-4567",
          icon: "Phone"
        },
        {
          title: "Live Chat",
          description: "Chat with us in real-time",
          contact: "Available 9AM-6PM EST",
          icon: "MessageCircle"
        }
      ],
      officeLocations: [
        {
          city: "San Francisco",
          address: "123 Innovation Drive, San Francisco, CA 94105",
          phone: "+1 (555) 123-4567",
          hours: "Mon-Fri 9AM-6PM PST"
        },
        {
          city: "New York",
          address: "456 Tech Avenue, New York, NY 10001",
          phone: "+1 (555) 987-6543",
          hours: "Mon-Fri 9AM-6PM EST"
        }
      ],
      faqs: [
        {
          question: "How do I invite my team members to join?",
          answer: "Simply create a team and share the invite link with your developers. They can join using the link or by searching for your team name."
        },
        {
          question: "Can I use B.A.B.Y. for free?",
          answer: "Yes! We offer a free plan that supports basic code analysis features. Upgrade to Pro for advanced features and team collaboration."
        },
        {
          question: "How do you handle code security and privacy?",
          answer: "Our code analysis feature helps you identify security vulnerabilities, optimize performance, and maintain code quality transparently with your team."
        },
        {
          question: "Is my code secure?",
          answer: "Absolutely. We use industry-standard encryption and security practices to protect your code and personal information."
        },
        {
          question: "Can I export my analysis reports and data?",
          answer: "Yes, you can export your flow diagrams, analysis reports, and optimization suggestions in various formats for your convenience."
        },
        {
          question: "Do you support multiple programming languages?",
          answer: "Yes! We support 50+ programming languages and frameworks, and our analysis tools will work with your preferred tech stack."
        }
      ],
      supportChannels: [
        {
          title: "Live Chat",
          description: "Get instant help from our support team",
          icon: "MessageCircle",
          cta: "Start Chat"
        },
        {
          title: "Community Forum",
          description: "Connect with other B.A.B.Y. users",
          icon: "Users",
          cta: "Join Forum"
        },
        {
          title: "Help Center",
          description: "Browse our comprehensive documentation",
          icon: "HelpCircle",
          cta: "Visit Help Center"
        }
      ],
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Join thousands of developers who are already using B.A.B.Y. to simplify their code development experience.",
        ctaPrimary: {
          text: "Start Free Trial",
          href: "/register"
        },
        ctaSecondary: {
          text: "Schedule Demo",
          href: "/contact"
        }
      }
    }

    return NextResponse.json(contactData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    )
  }
} 