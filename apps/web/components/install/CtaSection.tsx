"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function CtaSection() {
  return (
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
          Ready to Get Started?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90"
        >
          Join thousands of developers who are already using B.A.B.Y. to write better code.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
        >
          <Button size="lg" variant="secondary" className="w-full sm:w-auto group bg-white text-gray-800 hover:bg-gray-100">
            <span className="group-hover:scale-105 transition-transform">Start Free Trial</span>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800 w-full sm:w-auto group">
            <span className="group-hover:scale-105 transition-transform">Contact Sales</span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  )
} 