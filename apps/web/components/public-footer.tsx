"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Facebook, Instagram, Twitter, Linkedin, Github, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleNavigation } from "@/lib/utils"

export function PublicFooter() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: "#" },
    { icon: <Twitter className="h-4 w-4" />, href: "#" },
    { icon: <Instagram className="h-4 w-4" />, href: "#" },
    { icon: <Linkedin className="h-4 w-4" />, href: "#" },
    { icon: <Github className="h-4 w-4" />, href: "#" },
  ]

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Plugins", href: "/plugins" },
        { name: "Documentation", href: "#" },
        { name: "Releases", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "/contact" },
        { name: "News", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Cookie Policy", href: "/legal/cookies" },
        { name: "GDPR", href: "#" },
      ],
    },
  ]



  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">B.A.B.Y.</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered code assistant for flow diagrams, summaries, and more. Basic Assistant Bring Your Help.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                  <Link href={social.href} className="text-muted-foreground hover:text-foreground">
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide">{section.title}</h3>
              <ul className="space-y-1.5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} B.A.B.Y. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('/legal/terms')}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNavigation('/legal/privacy')}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigation('/legal/cookies')}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
