/**
 * MealSphere Application Configuration
 * 
 * This file contains all the configuration, metadata, and content
 * used throughout the application's public pages and components.
 */

export interface AppConfig {
  // Basic App Information
  app: {
    name: string
    shortName: string
    description: string
    longDescription: string
    version: string
    author: string
    website: string
    email: string
    phone: string
  }

  // SEO & Metadata
  seo: {
    title: string
    description: string
    keywords: string[]
    author: string
    robots: string
    ogType: string
    twitterCard: string
  }

  // Branding & Visual Identity
  branding: {
    logo: {
      icon: string
      text: string
      full: string
    }
    colors: {
      primary: string
      secondary: string
      accent: string
    }
    fonts: {
      primary: string
      secondary: string
    }
  }

  // Navigation
  navigation: {
    main: Array<{
      name: string
      href: string
      description?: string
    }>
    footer: {
      product: Array<{ name: string; href: string }>
      company: Array<{ name: string; href: string }>
      legal: Array<{ name: string; href: string }>
    }
  }

  // Social Media
  social: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    github: string
    youtube: string
  }

  // Contact Information
  contactInfo: {
    email: string
    phone: string
    address: string
    supportHours: string
    timezone: string
  }

  // Legal Information
  legalInfo: {
    companyName: string
    founded: string
    jurisdiction: string
    termsLastUpdated: string
    privacyLastUpdated: string
    cookiesLastUpdated: string
  }

  // Features & Capabilities
  features: Array<{
    id: number
    title: string
    description: string
    icon: string
    category: string
  }>

  // Hero Section Content
  hero: {
    title: string
    subtitle: string
    ctaPrimary: { text: string; href: string }
    ctaSecondary: { text: string; href: string }
    backgroundImage: string
  }

  // Showcase Section Content
  showcase: {
    title: string
    subtitle: string
    screenshots: {
      desktop: { image: string; alt: string; label: string }
      mobile: { image: string; alt: string; label: string }
    }
  }

  // About Page Content
  about: {
    hero: {
      title: string
      subtitle: string
      ctaPrimary: { text: string; href: string }
      ctaSecondary: { text: string; href: string }
    }
    stats: Array<{ number: string; label: string }>
    story: {
      title: string
      content: string[]
    }
    mission: {
      title: string
      description: string
    }
    vision: {
      title: string
      description: string
    }
    values: Array<{
      title: string
      description: string
      icon: string
    }>
    team: Array<{
      name: string
      role: string
      bio: string
      image: string
      linkedin: string
    }>
    cta: {
      title: string
      subtitle: string
      ctaPrimary: { text: string; href: string }
      ctaSecondary: { text: string; href: string }
    }
  }

  // Meal Plans Page Content
  mealPlans: {
    hero: {
      title: string
      subtitle: string
      ctaPrimary: { text: string; href: string }
      ctaSecondary: { text: string; href: string }
    }
    features: Array<{
      title: string
      description: string
      icon: string
    }>
  }

  // Recipes Page Content
  recipes: {
    hero: {
      title: string
      subtitle: string
      ctaPrimary: { text: string; href: string }
      ctaSecondary: { text: string; href: string }
    }
    recipeCategories: Array<{
      name: string
      icon: string
      count: number
    }>
  }

  // Contact Page Content
  contact: {
    hero: {
      title: string
      subtitle: string
    }
    info: {
      email: string
      phone: string
      address: string
      hours: string
    }
    form: {
      title: string
      subtitle: string
    }
  }

  // Legal Pages Content
  legal: {
    terms: {
      title: string
      lastUpdated: string
      sections: Array<{
        id: number
        title: string
        icon?: string
        content: any
      }>
    }
    privacy: {
      title: string
      lastUpdated: string
      sections: Array<{
        id: number
        title: string
        icon?: string
        content: any
      }>
    }
    cookies: {
      title: string
      lastUpdated: string
      sections: Array<{
        id: number
        title: string
        icon?: string
        content: any
      }>
    }
  }

  // Technical Configuration
  technical: {
    apiBaseUrl: string
    maxFileSize: string
    supportedFormats: string[]
    sessionTimeout: number
    paginationLimit: number
  }

  // Localization
  localization: {
    defaultLocale: string
    supportedLocales: string[]
    dateFormat: string
    timeFormat: string
    currency: string
  }
}

export const appConfig: AppConfig = {
  app: {
    name: "MealSphere",
    shortName: "MealSphere",
    description: "A comprehensive meal management system for roommates and hostels",
    longDescription: "Simplify your meal management with our comprehensive solution for roommates and shared living spaces. Track meals, calculate costs, and manage payments with ease.",
    version: "0.1.0",
    author: "MealSphere Team",
    website: "https://baby.vercel.app",
    email: "contact@mealsphere.com",
    phone: "+1 (555) 123-4567"
  },

  seo: {
    title: "MealSphere - Meal Management System",
    description: "A comprehensive meal management system for roommates and hostels. Track meals, calculate costs, and manage payments with ease.",
    keywords: [
      "meal management",
      "roommate expenses",
      "shared living",
      "meal tracking",
      "cost calculation",
      "hostel management",
      "roommate app",
      "expense sharing",
      "meal planning",
      "shared expenses"
    ],
    author: "MealSphere Team",
    robots: "index, follow",
    ogType: "website",
    twitterCard: "summary_large_image"
  },

  branding: {
    logo: {
      icon: "🍽️",
      text: "MealSphere",
      full: "MealSphere - Meal Management System"
    },
    colors: {
      primary: "#3B82F6",
      secondary: "#64748B",
      accent: "#F59E0B"
    },
    fonts: {
      primary: "Inter",
      secondary: "Geist"
    }
  },

  navigation: {
    main: [
      { name: "Recipes", href: "/recipes", description: "Discover amazing recipes" },
      { name: "Meal Plans", href: "/meal-plans", description: "Plan meals together" },
      { name: "About", href: "/about", description: "Learn about our mission" },
      { name: "Contact", href: "/contact", description: "Get in touch with us" }
    ],
    footer: {
      product: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "Releases", href: "#" }
      ],
      company: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "/contact" },
        { name: "News", href: "#" }
      ],
      legal: [
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Cookie Policy", href: "/legal/cookies" },
        { name: "GDPR", href: "#" }
      ]
    }
  },

  social: {
    facebook: "https://facebook.com/mealsphere",
    twitter: "https://twitter.com/mealsphere",
    instagram: "https://instagram.com/mealsphere",
    linkedin: "https://linkedin.com/company/mealsphere",
    github: "https://github.com/mealsphere",
    youtube: "https://youtube.com/@mealsphere"
  },

  contactInfo: {
    email: "contact@mealsphere.com",
    phone: "+1 (555) 123-4567",
    address: "123 Meal Street, Food City, FC 12345",
    supportHours: "Monday - Friday, 9:00 AM - 6:00 PM EST",
    timezone: "America/New_York"
  },

  legalInfo: {
    companyName: "MealSphere Inc.",
    founded: "2023",
    jurisdiction: "United States",
    termsLastUpdated: "January 15, 2025",
    privacyLastUpdated: "January 15, 2025",
    cookiesLastUpdated: "January 15, 2025"
  },

  features: [
    {
      id: 1,
      title: "Meal Tracking",
      description: "Track daily meals with ease. Mark your breakfast, lunch, and dinner with a simple click.",
      icon: "Utensils",
      category: "core"
    },
    {
      id: 2,
      title: "Room Management",
      description: "Create rooms, add members, and elect managers through a democratic voting system.",
      icon: "Users",
      category: "core"
    },
    {
      id: 3,
      title: "Payment Integration",
      description: "Integrated Bkash payment system for seamless meal cost settlements.",
      icon: "CreditCard",
      category: "payment"
    },
    {
      id: 4,
      title: "Cost Calculation",
      description: "Automatic calculation of meal rates, individual costs, and monthly summaries.",
      icon: "TrendingUp",
      category: "finance"
    },
    {
      id: 5,
      title: "Role-Based Access",
      description: "Different access levels for admins, managers, and members with customizable permissions.",
      icon: "Shield",
      category: "security"
    }
  ],

  hero: {
    title: "Simplify Your Meal Management",
    subtitle: "Track meals, calculate costs, and manage payments with ease. Perfect for roommates, hostels, and shared living spaces.",
    ctaPrimary: {
      text: "Get Started",
      href: "/register"
    },
    ctaSecondary: {
      text: "Learn More",
      href: "/about"
    },
    backgroundImage: "/banner-v2.png"
  },

  showcase: {
    title: "See MealSphere in Action",
    subtitle: "Experience a seamless interface on both desktop and mobile. Designed for clarity, speed, and ease of use.",
    screenshots: {
      desktop: {
        image: "/Screenshot-desktop.png",
        alt: "Desktop view screenshot",
        label: "Desktop View"
      },
      mobile: {
        image: "/Screenshot-phone.png",
        alt: "Phone view screenshot",
        label: "Phone View"
      }
    }
  },

  about: {
    hero: {
      title: "Building Better Communities",
      subtitle: "MealSphere was born from a simple observation: shared living can be challenging, but it doesn't have to be. We're on a mission to make roommates' lives easier, one meal at a time.",
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
      { number: "10K+", label: "Households" },
      { number: "1M+", label: "Meals Planned" },
      { number: "95%", label: "Satisfaction Rate" }
    ],
    story: {
      title: "Our Story",
      content: [
        "In 2023, our founders were struggling with the same problem millions of roommates face: coordinating meals, splitting grocery bills, and managing shared expenses. What started as a simple spreadsheet quickly evolved into something bigger.",
        "We realized that shared living doesn't have to be complicated. With the right tools, roommates can not only survive together but thrive together. That's why we built MealSphere - to transform the way people live together.",
        "Today, we're proud to serve thousands of households across the globe, helping them build stronger relationships through better meal management."
      ]
    },
    mission: {
      title: "Our Mission",
      description: "To simplify shared living by providing intuitive tools that help roommates coordinate meals, manage expenses, and build stronger communities. We believe that when people can easily share resources and responsibilities, everyone benefits."
    },
    vision: {
      title: "Our Vision",
      description: "To create a world where shared living is not just manageable, but enjoyable. We envision communities where roommates can focus on building relationships rather than managing logistics."
    },
    values: [
      {
        title: "Community First",
        description: "We believe in the power of community and design our tools to strengthen relationships.",
        icon: "Heart"
      },
      {
        title: "Simplicity",
        description: "Complex problems deserve simple solutions. We make the complicated easy to understand.",
        icon: "Zap"
      },
      {
        title: "Transparency",
        description: "Clear communication and honest pricing are at the core of everything we do.",
        icon: "Shield"
      },
      {
        title: "Innovation",
        description: "We continuously improve our platform based on user feedback and emerging needs.",
        icon: "Star"
      }
    ],
    team: [
      {
        name: "Sarah Johnson",
        role: "CEO & Co-Founder",
        bio: "Former product manager with a passion for solving real-world problems through technology.",
        image: "/team/sarah.jpg",
        linkedin: "https://linkedin.com/in/sarahjohnson"
      },
      {
        name: "Michael Chen",
        role: "CTO & Co-Founder",
        bio: "Full-stack developer with 10+ years of experience building scalable web applications.",
        image: "/team/michael.jpg",
        linkedin: "https://linkedin.com/in/michaelchen"
      }
    ],
    cta: {
      title: "Ready to Transform Your Shared Living?",
      subtitle: "Join thousands of roommates who are already enjoying better meal management.",
      ctaPrimary: {
        text: "Get Started Today",
        href: "/register"
      },
      ctaSecondary: {
        text: "Contact Sales",
        href: "/contact"
      }
    }
  },

  mealPlans: {
    hero: {
      title: "Plan Meals Together Smarter",
      subtitle: "Coordinate meals with your roommates, save money on groceries, and never wonder what's for dinner again. Our collaborative meal planning makes shared living delicious and efficient.",
      ctaPrimary: {
        text: "Start Planning",
        href: "/register"
      },
      ctaSecondary: {
        text: "Invite Roommates",
        href: "/register"
      }
    },
    features: [
      {
        title: "Collaborative Planning",
        description: "Plan meals together with your roommates in real-time",
        icon: "Users"
      },
      {
        title: "Smart Shopping Lists",
        description: "Automatically generate shopping lists from your meal plans",
        icon: "ShoppingCart"
      },
      {
        title: "Recipe Integration",
        description: "Access thousands of recipes and add them to your plans",
        icon: "ChefHat"
      },
      {
        title: "Time Management",
        description: "Plan cooking times and coordinate kitchen schedules",
        icon: "Clock"
      },
      {
        title: "Quick Setup",
        description: "Get started in minutes with our guided setup process",
        icon: "Zap"
      },
      {
        title: "Personalization",
        description: "Customize plans based on dietary preferences and budgets",
        icon: "Star"
      }
    ]
  },

  recipes: {
    hero: {
      title: "Discover Amazing Recipes",
      subtitle: "Explore our curated collection of delicious recipes perfect for roommates and shared living spaces. From quick breakfasts to elaborate dinners, find inspiration for every meal.",
      ctaPrimary: {
        text: "Browse Recipes",
        href: "/recipes"
      },
      ctaSecondary: {
        text: "View Meal Plans",
        href: "/meal-plans"
      }
    },
    recipeCategories: [
      { name: "Breakfast", icon: "🌅", count: 45 },
      { name: "Lunch", icon: "☀️", count: 67 },
      { name: "Dinner", icon: "🌙", count: 89 },
      { name: "Snacks", icon: "🍎", count: 34 },
      { name: "Desserts", icon: "🍰", count: 23 },
      { name: "Beverages", icon: "☕", count: 28 }
    ]
  },

  contact: {
    hero: {
      title: "Get in Touch",
      subtitle: "Have questions about MealSphere? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
    },
    info: {
      email: "contact@mealsphere.com",
      phone: "+1 (555) 123-4567",
      address: "123 Meal Street, Food City, FC 12345",
      hours: "Monday - Friday, 9:00 AM - 6:00 PM EST"
    },
    form: {
      title: "Send us a message",
      subtitle: "We'll get back to you within 24 hours."
    }
  },

  legal: {
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 15, 2025",
      sections: [
        {
          id: 1,
          title: "Introduction",
          icon: "Shield",
          content: [
            "Welcome to MealSphere (\"we,\" \"our,\" or \"us\"). These Terms of Service (\"Terms\") govern your use of our meal planning and shared living management platform, including our website, mobile applications, and related services (collectively, the \"Service\").",
            "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service."
          ]
        },
        {
          id: 2,
          title: "Service Description",
          content: [
            "MealSphere provides a platform for roommates and shared living communities to:",
            [
              "Plan and coordinate meals together",
              "Manage shared expenses and payments",
              "Track grocery shopping and meal preparation",
              "Access recipes and meal suggestions",
              "Communicate and collaborate on household management"
            ],
            "We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice."
          ]
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "January 15, 2025",
      sections: [
        {
          id: 1,
          title: "Introduction",
          icon: "Shield",
          content: [
            "MealSphere (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our meal planning and shared living management platform.",
            "By using our service, you consent to the data practices described in this policy."
          ]
        }
      ]
    },
    cookies: {
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
        }
      ]
    }
  },

  technical: {
    apiBaseUrl: "/api",
    maxFileSize: "10MB",
    supportedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    paginationLimit: 20
  },

  localization: {
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr"],
    dateFormat: "MM/DD/YYYY",
    timeFormat: "HH:mm",
    currency: "USD"
  }
}

// Export individual sections for easier imports
export const { app, seo, branding, navigation, social, contactInfo, legalInfo, features, hero, showcase, about, mealPlans, recipes, contact, legal, technical, localization } = appConfig

// Helper functions
export const getAppName = () => appConfig.app.name
export const getAppDescription = () => appConfig.app.description
export const getAppVersion = () => appConfig.app.version
export const getCurrentYear = () => new Date().getFullYear()

// Default export
export default appConfig 