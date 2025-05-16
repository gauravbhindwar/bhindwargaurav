'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
import AnimatedLetters from './AnimatedLetters'
import styles from './Hero.module.css'
import { useRef, useState, useEffect } from 'react'
// Add font imports for calligraphy and code
import { Kalam } from 'next/font/google'
import { Inter, Space_Mono, Fira_Code } from 'next/font/google'

// Initialize the fonts
const calligraphyFont = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-calligraphy'
})

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-space-mono'
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code'
})

export default function Hero() {
  const { reducedMotion } = useTheme()
  const curveCanvasRef = useRef(null)
  const codeElementsRef = useRef([])
  const [time, setTime] = useState(0)
  
  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }

  // Use your existing useEffect and useAnimationFrame code here...

  return (
    <section className={`${styles.heroSection} ${calligraphyFont.variable} relative min-h-[calc(100vh-4rem)] mt-5`}>
      {/* Background elements - your existing background code here */}
      
      {/* Main content */}
      <div className={`container px-4 sm:px-6 relative z-10 py-4 ${calligraphyFont.variable} ${interFont.variable} ${spaceMono.variable} ${firaCode.variable}`}>
        {/* Hero card with glassmorphism effect */}
        <motion.div 
          className={styles.heroCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text content - takes more space on larger screens */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Your existing content here... */}
            </motion.div>

            {/* Profile image container */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Your existing profile content here... */}
            </motion.div>
          </div>
          
          {/* Mathematical formula with enhanced styling and better responsive handling */}
          <motion.div
            className={styles.mathFormula}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.03 }}
          >
            <motion.span className={styles.sigma}>∑</motion.span>
            <div className={styles.formulaText}>
              <span>(creativity<sup>2</sup> + technology<sup>expertise</sup>) × passion = </span>
              <motion.span
                className={styles.resultText}
                animate={{
                  color: [
                    'hsl(var(--p))',
                    'hsl(var(--s))',
                    'hsl(var(--a))',
                    'hsl(var(--p))'
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                exceptional_results
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
