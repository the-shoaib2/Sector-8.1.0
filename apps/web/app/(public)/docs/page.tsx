"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Code2, Book, Search, FileText, Video, ArrowRight, ExternalLink, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const categories = [
  {
    name: "Getting Started",
    description: "Learn the basics and set up B.A.B.Y. for your project",
    icon: <Book className="w-6 h-6" />,
    color: "bg-blue-500",
    articles: [
      "Quick Start Guide",
      "Installation",
      "First Analysis",
      "Configuration"
    ]
  },
  {
    name: "API Reference",
    description: "Complete API documentation and examples",
    icon: <Code2 className="w-6 h-6" />,
    color: "bg-green-500",
    articles: [
      "Authentication",
      "Code Analysis",
      "Flow Diagrams",
      "Error Detection"
    ]
  },
  {
    name: "Tutorials",
    description: "Step-by-step guides for common use cases",
    icon: <Video className="w-6 h-6" />,
    color: "bg-purple-500",
    articles: [
      "Analyzing React Components",
      "Debugging Python Code",
      "Optimizing Performance",
      "Team Collaboration"
    ]
  },
  {
    name: "Examples",
    description: "Real-world examples and code samples",
    icon: <FileText className="w-6 h-6" />,
    articles: [
      "JavaScript Examples",
      "Python Examples",
      "TypeScript Examples",
      "Integration Examples"
    ]
  }
]

const popularArticles = [
  {
    title: "Getting Started with B.A.B.Y.",
    description: "Learn how to set up and use B.A.B.Y. for your first code analysis",
    category: "Getting Started",
    readTime: "5 min read"
  },
  {
    title: "Understanding Flow Diagrams",
    description: "Learn how to interpret and create flow diagrams from your code",
    category: "Tutorials",
    readTime: "8 min read"
  },
  {
    title: "API Authentication Guide",
    description: "Complete guide to authenticating with the B.A.B.Y. API",
    category: "API Reference",
    readTime: "6 min read"
  },
  {
    title: "Code Optimization Best Practices",
    description: "Learn how to optimize your code using B.A.B.Y.'s analysis tools",
    category: "Tutorials",
    readTime: "10 min read"
  }
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 animate-pulse">
              <Book className="w-4 h-4 mr-2" />
              Documentation
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              B.A.B.Y. Documentation
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Everything you need to know about using B.A.B.Y. for code analysis, flow diagrams, and AI-powered development.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Articles */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Popular Articles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start with these essential guides to get the most out of B.A.B.Y.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{article.title}</CardTitle>
                    <CardDescription className="text-sm">{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full group" size="sm">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Documentation Categories */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Documentation Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive documentation organized by topic
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors mb-4">
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{category.name}</CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center justify-between group/item">
                          <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">{article}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 group" variant="outline">
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quick Links */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Need Help?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Book className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Comprehensive Guides</h3>
                    <p className="text-sm text-muted-foreground">Step-by-step tutorials for every feature</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Code2 className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">API Examples</h3>
                    <p className="text-sm text-muted-foreground">Real code examples for all endpoints</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground">Visual guides for complex topics</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      API Reference
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub Repository
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Community Forum
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="#" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Support Center
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary"
      >
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            Can't Find What You're Looking For?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90"
          >
            Our support team is here to help you get the most out of B.A.B.Y.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" className="w-full sm:w-auto group bg-white text-gray-800 hover:bg-gray-100">
              <span className="group-hover:scale-105 transition-transform">Contact Support</span>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800 w-full sm:w-auto group">
              <span className="group-hover:scale-105 transition-transform">Join Community</span>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
} 