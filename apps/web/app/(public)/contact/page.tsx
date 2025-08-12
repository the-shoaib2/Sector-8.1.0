"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, Send, Users, RefreshCw, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { usePublicData } from "@/hooks/use-public-data"

interface ContactData {
  hero: {
    title: string
    subtitle: string
  }
  contactMethods: Array<{
    title: string
    description: string
    contact: string
    icon: string
  }>
  officeLocations: Array<{
    city: string
    address: string
    phone: string
    hours: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  supportChannels: Array<{
    title: string
    description: string
    icon: string
    cta: string
  }>
  cta: {
    title: string
    subtitle: string
    ctaPrimary: { text: string; href: string }
    ctaSecondary: { text: string; href: string }
  }
}

const iconMap = {
  Mail,
  Phone,
  MessageCircle,
  Users,
  HelpCircle
}

export default function ContactPage() {
  const { toast } = useToast()
  const { data, loading, error } = usePublicData<ContactData>({ endpoint: "contact" })
  const [isLoading, setIsLoading] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaImage, setCaptchaImage] = useState<string>("")
  const [captchaId, setCaptchaId] = useState<string>("")
  const [captchaText, setCaptchaText] = useState<string>("")
  const [captchaInput, setCaptchaInput] = useState<string>("")
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.02 }
  }

  // Generate CAPTCHA
  const generateCaptcha = async () => {
    try {
      const response = await fetch('/api/captcha')
      if (response.ok) {
        const svg = await response.text()
        const captchaId = response.headers.get('X-Captcha-ID')
        const captchaText = response.headers.get('X-Captcha-Text')
        
        setCaptchaImage(svg)
        setCaptchaId(captchaId || "")
        setCaptchaText(captchaText || "")
        setCaptchaInput("")
        setIsCaptchaValid(null)
      }
    } catch (error) {
      console.error('Failed to generate CAPTCHA:', error)
    }
  }

  // Validate CAPTCHA
  const validateCaptcha = async () => {
    if (!captchaInput.trim()) {
      setIsCaptchaValid(false)
      return false
    }

    try {
      const response = await fetch('/api/captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captchaId,
          userInput: captchaInput,
          captchaText
        }),
      })

      const result = await response.json()
      setIsCaptchaValid(result.valid)
      return result.valid
    } catch (error) {
      console.error('Failed to validate CAPTCHA:', error)
      setIsCaptchaValid(false)
      return false
    }
  }

  // Handle initial form validation and show CAPTCHA
  const handleShowCaptcha = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    // Generate and show CAPTCHA
    await generateCaptcha()
    setShowCaptcha(true)
  }

  // Handle final form submission with CAPTCHA
  const handleSubmitWithCaptcha = async () => {
    // Validate CAPTCHA
    const isCaptchaValid = await validateCaptcha()
    if (!isCaptchaValid) {
      toast({
        title: "Error",
        description: "Please enter the correct CAPTCHA code",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaId,
          captchaText,
          userInput: captchaInput
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Show success toast
        toast({
          title: "Message Sent Successfully! 🎉",
          description: result.message,
          variant: "default"
        })
        
        // Show success state
        setIsSuccess(true)
        
        // Reset form and hide CAPTCHA
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: ""
        })
        setCaptchaInput("")
        setShowCaptcha(false)
        setCaptchaImage("")
        
        // Hide success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Failed to submit form:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Go back to form (hide CAPTCHA)
  const handleBackToForm = () => {
    setShowCaptcha(false)
    setCaptchaInput("")
    setIsCaptchaValid(null)
  }

  // Reset form and start over
  const handleResetForm = () => {
    setIsSuccess(false)
    setShowCaptcha(false)
    setCaptchaInput("")
    setIsCaptchaValid(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: ""
    })
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Backdrop blur background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 backdrop-blur-3xl -z-10" />
      
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
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4 animate-pulse">
              <MessageCircle className="w-4 h-4 mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {data?.hero?.title || "Get in Touch with B.A.B.Y."}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              {data?.hero?.subtitle || "Have questions about our AI code assistant? We're here to help you understand code better."}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data?.contactMethods?.map((method, index) => {
              const IconComponent = iconMap[method.icon as keyof typeof iconMap] || MessageCircle
              
              return (
              <motion.div
                key={method.title}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{method.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3">{method.description}</p>
                    <p className="text-primary font-medium">{method.contact}</p>
                  </CardContent>
                </Card>
              </motion.div>
              )
            }) || Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Loading...</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3">Loading contact method...</p>
                    <p className="text-primary font-medium">Loading...</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form & Info */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Send us a Message</h2>
              
              {isSuccess ? (
                // Success State
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent Successfully!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={handleResetForm} className="w-full">
                      Send Another Message
                    </Button>
                    <Button variant="outline" onClick={handleResetForm} className="w-full">
                      Back to Form
                    </Button>
                  </div>
                </motion.div>
              ) : !showCaptcha ? (
                // Initial Form
                <form onSubmit={handleShowCaptcha} className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                      <Input 
                        placeholder="Enter your firstname"
                        className="backdrop-blur-sm"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                      <Input 
                        placeholder="Enter your lastname" 
                        className="backdrop-blur-sm"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="backdrop-blur-sm"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                    <Input 
                      placeholder="How can we help you?" 
                      className="backdrop-blur-sm"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea 
                      placeholder="Tell us more about your question or feedback..."
                      rows={6}
                      className="backdrop-blur-sm"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:scale-105 transition-transform">Send Email</span>
                  </Button>
                </form>
              ) : (
                // CAPTCHA Verification Step
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Security Verification</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please complete the security verification to send your message.
                    </p>
                    
                    {/* Form Summary */}
                    <div className="space-y-2 text-sm">
                      <p><strong>From:</strong> {formData.firstName} {formData.lastName} ({formData.email})</p>
                      <p><strong>Subject:</strong> {formData.subject}</p>
                      <p><strong>Message:</strong> {formData.message.substring(0, 100)}{formData.message.length > 100 ? '...' : ''}</p>
                    </div>
                  </div>

                  {/* CAPTCHA Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <label className="block text-sm font-medium text-foreground mb-3">Enter the code below *</label>
                      
                      {/* CAPTCHA Image Container */}
                      <div className="flex justify-center items-center gap-3 mb-4">
                        {captchaImage && (
                          <div className="flex justify-center">
                            <div 
                              className="overflow-hidden rounded-lg inline-block border border-border/50 shadow-sm"
                              dangerouslySetInnerHTML={{ __html: captchaImage }}
                            />
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={generateCaptcha}
                          className="shrink-0 hover:bg-primary/10"
                          title="Refresh CAPTCHA"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* CAPTCHA Input */}
                      <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
                        <Input
                          placeholder="Enter the code above"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          className="backdrop-blur-sm text-center"
                          required
                        />
                        {isCaptchaValid === true && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                        {isCaptchaValid === false && (
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleBackToForm}
                      className="flex-1"
                    >
                      Back to Form
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleSubmitWithCaptcha}
                      className="flex-1 group" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          <span className="group-hover:scale-105 transition-transform">Send Message</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">Office Locations</h2>
              <div className="space-y-4 sm:space-y-6">
                {data?.officeLocations?.map((office, index) => (
                  <motion.div
                    key={office.city}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg sm:text-xl group-hover:text-primary transition-colors">
                          <MapPin className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                          {office.city}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{office.address}</p>
                        <p className="text-muted-foreground flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {office.phone}
                        </p>
                        <p className="text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {office.hours}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )) || Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg sm:text-xl group-hover:text-primary transition-colors">
                          <MapPin className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                          Loading Office...
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">Loading address...</p>
                        <p className="text-muted-foreground flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Loading phone...
                        </p>
                        <p className="text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Loading hours...
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about MealSphere
            </p>
          </motion.div>
          <div className="space-y-4 sm:space-y-6">
            {data?.faqs?.map((faq, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base sm:text-lg group-hover:text-primary transition-colors">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )) || Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-base sm:text-lg group-hover:text-primary transition-colors">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                      Loading question...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Loading answer...</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Support Channels */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6"
          >
            Need More Help?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto"
          >
            We're here to help you get the most out of MealSphere. Choose the support option that works best for you.
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {data?.supportChannels?.map((channel, index) => {
              const IconComponent = iconMap[channel.icon as keyof typeof iconMap] || MessageCircle
              
              return (
                <motion.div key={channel.title} variants={cardVariants} whileHover="hover" className="group">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <motion.div 
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
                  </motion.div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{channel.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">{channel.description}</p>
                  <Button variant="outline" className="w-full group">
                        <span className="group-hover:scale-105 transition-transform">{channel.cta}</span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
              )
            }) || Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={cardVariants} whileHover="hover" className="group">
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 group-hover:bg-primary/5 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Loading...</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">Loading support channel...</p>
                    <Button variant="outline" className="w-full group">
                      <span className="group-hover:scale-105 transition-transform">Loading...</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            {data?.cta?.title || "Ready to Get Started?"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90"
          >
            {data?.cta?.subtitle || "Join thousands of roommates who are already using MealSphere to simplify their shared living experience."}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" className="w-full sm:w-auto group">
              <span className="group-hover:scale-105 transition-transform">{data?.cta?.ctaPrimary?.text || "Start Free Trial"}</span>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto group">
              <span className="group-hover:scale-105 transition-transform">{data?.cta?.ctaSecondary?.text || "Schedule Demo"}</span>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
} 