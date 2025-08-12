import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate API delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 600))

    const aboutData = {
      hero: {
        title: "Building Better Code",
        subtitle: "B.A.B.Y. was born from a simple observation: code analysis can be challenging, but it doesn't have to be. We're on a mission to make developers' lives easier, one line of code at a time.",
        ctaPrimary: {
          text: "Join Our Mission",
          href: "/register"
        },
        ctaSecondary: {
          text: "Learn More",
          href: "#story"
        }
      },
      stats: [
        { number: "50K+", label: "Active Users" },
        { number: "10K+", label: "Development Teams" },
        { number: "1M+", label: "Code Files Analyzed" },
        { number: "95%", label: "Satisfaction Rate" }
      ],
      story: {
        title: "Our Story",
        content: [
          "In 2023, our founders were struggling with the same problem millions of developers face: understanding complex code, debugging issues, and optimizing performance. What started as a simple code analyzer quickly evolved into something bigger.",
          "We realized that code analysis doesn't have to be complicated. With the right tools, developers can not only write better code but understand it better too. That's why we built B.A.B.Y. - to transform the way people develop software.",
          "Today, we're proud to serve thousands of developers across the globe, helping them build better software through AI-powered code analysis."
        ]
      },
      mission: {
        title: "Our Mission",
        description: "To simplify code development by providing intuitive tools that help developers analyze code, optimize performance, and build better software. We believe that when developers can easily understand and improve their code, everyone benefits."
      },
      vision: {
        title: "Our Vision",
        description: "A world where code development is not just a necessity but a choice people make because it's better than manual analysis. We envision communities where developers become more productive, teams become more efficient, and AI-powered tools create better software for everyone."
      },
      values: [
        {
          title: "Developer First",
          description: "We believe in the power of developers and building tools that enhance their productivity.",
          icon: "Heart"
        },
        {
          title: "Collaboration",
          description: "Every feature is designed to bring teams together and make code collaboration seamless.",
          icon: "Users"
        },
        {
          title: "Simplicity",
          description: "Complex code deserves simple analysis that anyone can use and understand.",
          icon: "Target"
        },
        {
          title: "Trust & Security",
          description: "Your code and privacy are our top priorities, always protected and never compromised.",
          icon: "Shield"
        },
        {
          title: "Innovation",
          description: "Constantly pushing boundaries to create better experiences for code development.",
          icon: "Zap"
        },
        {
          title: "Inclusivity",
          description: "Building for everyone, regardless of programming language, framework, or development environment.",
          icon: "Globe"
        }
      ],
      team: [
        {
          name: "Sarah Johnson",
          role: "CEO & Co-Founder",
          bio: "Former product manager at Google, passionate about solving real-world problems through technology.",
          image: "/placeholder.jpg",
          linkedin: "#"
        },
        {
          name: "Michael Chen",
          role: "CTO & Co-Founder",
          bio: "Full-stack developer with 10+ years experience building scalable applications.",
          image: "/placeholder.jpg",
          linkedin: "#"
        },
        {
          name: "Emily Rodriguez",
          role: "Head of Product",
          bio: "UX designer turned product manager, focused on creating intuitive user experiences.",
          image: "/placeholder.jpg",
          linkedin: "#"
        },
        {
          name: "David Kim",
          role: "Head of Engineering",
          bio: "Backend specialist with expertise in distributed systems and cloud architecture.",
          image: "/placeholder.jpg",
          linkedin: "#"
        }
      ],
      cta: {
        title: "Join Us in Building Better Code",
        subtitle: "Whether you're a developer, team lead, or just someone who believes in the power of better software, we'd love to hear from you.",
        ctaPrimary: {
          text: "Get Started",
          href: "/register"
        },
        ctaSecondary: {
          text: "Contact Us",
          href: "/contact"
        }
      }
    }

    return NextResponse.json(aboutData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    )
  }
} 