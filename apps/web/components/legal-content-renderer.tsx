"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Calendar, Lock, Cookie, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface LegalContentRendererProps {
  data?: {
    title: string
    lastUpdated: string
    sections: any[]
  } | null
  type: 'terms' | 'privacy' | 'cookies'
  isLoading?: boolean
}

const iconMap = {
  Shield,
  FileText,
  Calendar,
  Lock,
  Cookie
}

export function LegalContentRenderer({ data, type, isLoading = false }: LegalContentRendererProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.01, y: -2 }
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent ? <IconComponent className="w-5 h-5 mr-2 text-primary" /> : null
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'terms':
        return <FileText className="w-4 h-4 mr-2" />
      case 'privacy':
        return <Lock className="w-4 h-4 mr-2" />
      case 'cookies':
        return <Cookie className="w-4 h-4 mr-2" />
      default:
        return <FileText className="w-4 h-4 mr-2" />
    }
  }

  const renderContent = (content: any): React.ReactNode => {
    if (typeof content === 'string') {
      return <p className="text-muted-foreground leading-relaxed">{content}</p>
    }
    
    if (Array.isArray(content)) {
      return (
        <div className="space-y-3">
          {content.map((item, index) => (
            <div key={index}>
              {renderContent(item)}
            </div>
          ))}
        </div>
      )
    }
    
    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => (
            <div key={key} className="space-y-2">
              {typeof value === 'object' && value !== null && 'title' in value && (
                <h4 className="font-semibold text-foreground text-sm">
                  {(value as any).title}
                </h4>
              )}
              {typeof value === 'object' && value !== null && 'description' in value && (
                <p className="text-muted-foreground text-sm mb-2">
                  {(value as any).description}
                </p>
              )}
              {typeof value === 'object' && value !== null && 'items' in value && Array.isArray((value as any).items) && (
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-muted-foreground">
                  {(value as any).items.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
              {typeof value === 'object' && value !== null && 'note' in value && (
                <p className="text-xs text-muted-foreground/70 italic mt-2">
                  {(value as any).note}
                </p>
              )}
              {typeof value === 'string' && (
                <p className="text-muted-foreground text-sm">{value}</p>
              )}
            </div>
          ))}
        </div>
      )
    }
    
    return null
  }

  // Loading state
  if (isLoading ) {
    return null
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Optimized backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/3 via-background to-primary/3 backdrop-blur-2xl -z-10" />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="mb-3 animate-pulse">
              {getTypeIcon()}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {data?.title.split(' ').slice(0, -1).join(' ')}
              <span className="text-primary"> {data?.title.split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 px-4">
              {type === 'terms' && "Please read these terms carefully before using MealSphere. By using our service, you agree to be bound by these terms."}
              {type === 'privacy' && "We respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data?."}
              {type === 'cookies' && "Learn how we use cookies and similar technologies to enhance your experience on MealSphere and provide you with personalized content and services."}
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Last updated: {data?.lastUpdated}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Sections */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {data?.sections.map((section, index) => (
              <motion.div 
                key={section.id} 
                variants={cardVariants} 
                whileHover="hover"
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-primary/20 group-hover:bg-primary/2 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-base sm:text-lg group-hover:text-primary transition-colors">
                      {getIcon(section.icon)}
                      {section.id}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {renderContent(section.content)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
} 