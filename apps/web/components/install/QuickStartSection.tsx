"use client"

import { motion } from "framer-motion"

const quickStart = [
  {
    step: 1,
    title: "Choose Your Platform",
    description: "Select the installation method that works best for your workflow"
  },
  {
    step: 2,
    title: "Install B.A.B.Y.",
    description: "Follow the platform-specific installation instructions"
  },
  {
    step: 3,
    title: "Sign Up or Sign In",
    description: "Create your account or log in to existing account"
  },
  {
    step: 4,
    title: "Start Coding",
    description: "Begin using B.A.B.Y. to analyze and improve your code"
  }
]

export default function QuickStartSection() {
  return (
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Quick Installation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get B.A.B.Y. running in your IDE in just a few simple steps
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStart.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
} 