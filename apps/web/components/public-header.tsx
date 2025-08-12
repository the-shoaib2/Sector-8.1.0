"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search as SearchIcon, Code2, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "next-auth/react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { UserAvatar } from "./user-avatar"
import { handleNavigation } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

const navLinks = [
  { name: 'Ai', href: '/ai' },
  { name: 'Docs', href: '/docs' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Support', href: '/support' },
  { name: 'Contact', href: '/contact' },
]

export function PublicHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const isMobile = useIsMobile()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check if a link is active
  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 backdrop-blur-md px-4 md:px-6">
      <div className="w-full flex h-16 items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => handleNavigation('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Code2 className="h-8 w-8" />
            <span className="font-bold text-xl">Synapse</span>
          </button>
          <nav className="hidden md:flex items-center ml-8 space-x-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                onClick={() => handleNavigation(link.href)}
                variant={isActive(link.href) ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-full transition-all px-3",
                  isActive(link.href)
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Button>
            ))}
          </nav>
        </div>

        {session ? (
          <div className="hidden md:flex items-center gap-4">
            <UserAvatar user={{
              id: session.user.id,
              name: session.user.name || undefined,
              email: session.user.email || undefined,
              image: session.user.image || undefined,
              role: session.user.role || undefined
            }} />
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => handleNavigation('/login')}>
              Sign in
            </Button>
            <Button variant="default" size="sm" className="rounded-full px-4" onClick={() => handleNavigation('/register')}>
              Get Started
            </Button>
          </div>
        )}

        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 space-y-6">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Button
                        key={link.name}
                        onClick={() => {
                          handleNavigation(link.href)
                          setIsMenuOpen(false)
                        }}
                        variant={isActive(link.href) ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start rounded-full transition-all",
                          isActive(link.href)
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.name}
                      </Button>
                    ))}
                  </div>
                  {/* Only show auth buttons if not authenticated; if authenticated, show user info and logout */}
                  {session ? (
                    <div className="pt-4 border-t space-y-3 flex flex-col items-center">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                        <AvatarFallback>
                          {session.user?.name
                            ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <div className="font-semibold text-base">{session.user?.name || "User"}</div>
                        {session.user?.email && (
                          <div className="text-xs text-muted-foreground">{session.user.email}</div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-3 flex items-center justify-center"
                        onClick={async () => {
                          try {
                            // First, call our backend logout API to clear server-side session and cookies
                            try {
                              const response = await fetch('/api/auth/logout', { 
                                method: 'POST',
                                credentials: 'include' // Include cookies in the request
                              });
                              
                              if (!response.ok) {
                                console.error('Backend logout failed:', response.status);
                              }
                            } catch (error) {
                              console.error('Backend logout failed:', error);
                              // Continue with frontend logout even if backend fails
                            }
                            
                            // Clear any local storage or session storage that might contain auth data
                            if (typeof window !== 'undefined') {
                              // Clear NextAuth.js related storage
                              localStorage.removeItem('next-auth.session-token');
                              localStorage.removeItem('__Secure-next-auth.session-token');
                              localStorage.removeItem('next-auth.csrf-token');
                              localStorage.removeItem('__Secure-next-auth.csrf-token');
                              localStorage.removeItem('next-auth.callback-url');
                              localStorage.removeItem('__Secure-next-auth.callback-url');
                              
                              // Clear session storage
                              sessionStorage.removeItem('next-auth.session-token');
                              sessionStorage.removeItem('__Secure-next-auth.session-token');
                              sessionStorage.removeItem('next-auth.csrf-token');
                              sessionStorage.removeItem('__Secure-next-auth.csrf-token');
                              sessionStorage.removeItem('next-auth.callback-url');
                              sessionStorage.removeItem('__Secure-next-auth.callback-url');
                              
                              // Clear any other auth-related storage
                              localStorage.removeItem('auth-token');
                              localStorage.removeItem('session-token');
                              localStorage.removeItem('user-token');
                              sessionStorage.removeItem('auth-token');
                              sessionStorage.removeItem('session-token');
                              sessionStorage.removeItem('user-token');
                              
                              // Client-side cookie clearing as a fallback
                              const cookiesToClear = [
                                'next-auth.session-token',
                                '__Secure-next-auth.session-token',
                                'next-auth.csrf-token',
                                '__Secure-next-auth.csrf-token',
                                'next-auth.callback-url',
                                '__Secure-next-auth.callback-url',
                                'next-auth.pkce.code-verifier',
                                '__Secure-next-auth.pkce.code-verifier',
                                'next-auth.state',
                                '__Secure-next-auth.state',
                                'next-auth.nonce',
                                '__Secure-next-auth.nonce',
                                'next-auth.provider',
                                '__Secure-next-auth.provider'
                              ];
                              
                              cookiesToClear.forEach(cookieName => {
                                // Try to clear cookie by setting it to expire
                                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
                                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
                              });
                            }
                            
                            // Then use NextAuth.js signOut to clear frontend session and cookies
                            await signOut({ 
                              callbackUrl: "/",
                              redirect: true 
                            });
                            
                            // Force refresh the page to ensure all state is cleared
                            // This is a fallback to ensure complete cleanup
                            setTimeout(() => {
                              window.location.reload();
                            }, 100);
                          } catch (error) {
                            console.error('Logout failed:', error);
                          }
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}

      </div>
    </header>
  )
}

