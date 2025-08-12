"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code2, Calendar, User, ArrowRight, Tag } from "lucide-react"
import { motion } from "framer-motion"

const blogPosts = [
  {
    title: "Introducing B.A.B.Y.: The Future of Code Analysis",
    description: "Discover how our new AI-powered code assistant is revolutionizing the way developers write and understand code.",
    author: "B.A.B.Y. Team",
    date: "2024-01-15",
    category: "Product",
    readTime: "5 min read",
    featured: true
  },
  {
    title: "How Flow Diagrams Improve Code Understanding",
    description: "Learn how visual representations of code flow can help teams better understand complex systems.",
    author: "Sarah Chen",
    date: "2024-01-12",
    category: "Tutorial",
    readTime: "8 min read"
  },
  {
    title: "AI-Powered Code Optimization: A Deep Dive",
    description: "Explore the algorithms behind B.A.B.Y.'s intelligent code optimization suggestions.",
    author: "Dr. Michael Rodriguez",
    date: "2024-01-10",
    category: "Technical",
    readTime: "12 min read"
  },
  {
    title: "Building Better Code Reviews with B.A.B.Y.",
    description: "Tips and tricks for using B.A.B.Y. to improve your code review process.",
    author: "Alex Thompson",
    date: "2024-01-08",
    category: "Best Practices",
    readTime: "6 min read"
  },
  {
    title: "The Evolution of AI in Software Development",
    description: "A comprehensive look at how AI is transforming the software development landscape.",
    author: "B.A.B.Y. Team",
    date: "2024-01-05",
    category: "Industry",
    readTime: "10 min read"
  },
  {
    title: "Getting Started with B.A.B.Y. CLI",
    description: "A step-by-step guide to using B.A.B.Y. from the command line.",
    author: "David Kim",
    date: "2024-01-03",
    category: "Tutorial",
    readTime: "7 min read"
  }
]

const categories = ["All", "Product", "Tutorial", "Technical", "Best Practices", "Industry"]

export default function BlogPage() {
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
              <Code2 className="w-4 h-4 mr-2" />
              Blog & Updates
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              B.A.B.Y. Blog
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Stay updated with the latest features, tutorials, and insights about AI-powered code analysis and development.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <Button size="lg" className="w-full sm:w-auto group">
                <Code2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Subscribe to Updates
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                <ArrowRight className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View All Posts
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-8 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="rounded-full px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Post */}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Featured Article</h2>
          </motion.div>
          {blogPosts.filter(post => post.featured).map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-primary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription className="text-lg">{post.description}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                                              <span>{new Date(post.date).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="group" variant="outline">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Latest Articles</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our latest insights, tutorials, and updates about B.A.B.Y. and AI-powered development
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.div
                key={post.title}
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
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="text-sm">{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
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

      {/* Newsletter Signup */}
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
            Stay Updated with B.A.B.Y.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90"
          >
            Get the latest updates, tutorials, and insights delivered to your inbox.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto"
          >
            <Button size="lg" variant="secondary" className="w-full sm:w-auto group bg-white text-gray-800 hover:bg-gray-100">
              <span className="group-hover:scale-105 transition-transform">Subscribe to Newsletter</span>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
} 