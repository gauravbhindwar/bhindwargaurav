'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionType, setTransitionType] = useState('brush') // 'brush', 'ripple', 'slide', 'morph'

  const toggleTheme = (animationType = 'brush') => {
    if (isTransitioning) return // Prevent multiple transitions
    
    setIsTransitioning(true)
    setTransitionType(animationType)
    
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // Start transition animation
    setTimeout(() => {
      setTheme(newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('theme', newTheme)
      
      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 800)
    }, 200)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReducedMotion)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, reducedMotion, isTransitioning }}>
      {children}
      <ThemeTransitionOverlay 
        isTransitioning={isTransitioning} 
        transitionType={transitionType}
        theme={theme}
      />
    </ThemeContext.Provider>
  )
}

// Creative Theme Transition Overlay Component
const ThemeTransitionOverlay = ({ isTransitioning, transitionType, theme }) => {
  if (!isTransitioning) return null

  const overlayVariants = {
    brush: {
      initial: { scaleX: 0, transformOrigin: 'left' },
      animate: { 
        scaleX: [0, 1.2, 0], 
        transition: { 
          duration: 0.8, 
          times: [0, 0.6, 1],
          ease: [0.25, 0.46, 0.45, 0.94]
        } 
      }
    },
    ripple: {
      initial: { scale: 0, opacity: 0.8 },
      animate: { 
        scale: [0, 0.5, 2.5], 
        opacity: [0.8, 0.6, 0],
        transition: { 
          duration: 0.8, 
          times: [0, 0.3, 1],
          ease: "easeOut"
        } 
      }
    },
    slide: {
      initial: { x: '-100%' },
      animate: { 
        x: ['100%', '-10%', '100%'], 
        transition: { 
          duration: 0.8, 
          times: [0, 0.5, 1],
          ease: [0.76, 0, 0.24, 1]
        } 
      }
    },
    morph: {
      initial: { 
        borderRadius: '50%', 
        scale: 0,
        rotate: 0
      },
      animate: { 
        borderRadius: ['50%', '20%', '0%'],
        scale: [0, 0.8, 3],
        rotate: [0, 180, 360],
        transition: { 
          duration: 0.8,
          times: [0, 0.5, 1],
          ease: "anticipate"
        } 
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {transitionType === 'brush' && (
          <>
            {/* Brush stroke effect */}
            <motion.div
              className={`absolute inset-0 ${theme === 'dark' ? 'bg-base-100' : 'bg-base-900'}`}
              variants={overlayVariants.brush}
              initial="initial"
              animate="animate"
              style={{ 
                background: theme === 'dark' 
                  ? 'linear-gradient(90deg, hsl(var(--b1)) 0%, hsl(var(--b2)) 50%, hsl(var(--b3)) 100%)'
                  : 'linear-gradient(90deg, hsl(var(--b3)) 0%, hsl(var(--b2)) 50%, hsl(var(--b1)) 100%)'
              }}
            />
            
            {/* Paint drip particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `hsl(var(--p))`,
                  left: `${10 + i * 7}%`,
                  top: `${20 + Math.sin(i) * 30}%`,
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  y: -20
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.5, 0.5],
                  y: [0, 40, 100],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  delay: i * 0.05,
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {transitionType === 'ripple' && (
          <>
            {/* Multiple ripple circles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-4"
                style={{
                  borderColor: i === 0 ? 'hsl(var(--p))' : i === 1 ? 'hsl(var(--s))' : 'hsl(var(--a))',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: i === 1 ? (theme === 'dark' ? 'hsl(var(--b1))' : 'hsl(var(--b3))') : 'transparent',
                }}
                variants={overlayVariants.ripple}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 }}
              />
            ))}
            
            {/* Center expanding circle */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: theme === 'dark' 
                  ? 'radial-gradient(circle, hsl(var(--b1)) 0%, hsl(var(--b2)) 70%, transparent 100%)'
                  : 'radial-gradient(circle, hsl(var(--b3)) 0%, hsl(var(--b2)) 70%, transparent 100%)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
              }}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ 
                scale: [0, 15], 
                opacity: [0.9, 0.7, 0],
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
            />
          </>
        )}

        {transitionType === 'slide' && (
          <>
            {/* Sliding panels */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(45deg, 
                  hsl(var(--p)) 0%, 
                  hsl(var(--s)) 25%, 
                  ${theme === 'dark' ? 'hsl(var(--b1))' : 'hsl(var(--b3))'} 50%, 
                  hsl(var(--a)) 75%, 
                  hsl(var(--n)) 100%)`,
              }}
              variants={overlayVariants.slide}
              initial="initial"
              animate="animate"
            />
            
            {/* Geometric shapes sliding */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute ${i % 2 === 0 ? 'rounded-full' : 'rounded-xl rotate-45'}`}
                style={{
                  background: i % 3 === 0 ? 'hsl(var(--p))' : i % 3 === 1 ? 'hsl(var(--s))' : 'hsl(var(--a))',
                  width: `${20 + i * 5}px`,
                  height: `${20 + i * 5}px`,
                  left: `${10 + i * 10}%`,
                  top: `${20 + Math.sin(i) * 40}%`,
                }}
                initial={{ x: '-200%', rotate: 0 }}
                animate={{ 
                  x: ['200%', '-50%', '200%'],
                  rotate: [0, 180, 360],
                  scale: [1, 1.3, 0.8]
                }}
                transition={{ 
                  delay: i * 0.08,
                  duration: 0.8,
                  ease: "easeInOut"
                }}
              />
            ))}
          </>
        )}

        {transitionType === 'morph' && (
          <>
            {/* Morphing central shape */}
            <motion.div
              className="absolute"
              style={{
                background: `conic-gradient(from 0deg, 
                  hsl(var(--p)), 
                  hsl(var(--s)), 
                  hsl(var(--a)), 
                  ${theme === 'dark' ? 'hsl(var(--b1))' : 'hsl(var(--b3))'}, 
                  hsl(var(--p)))`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
              }}
              variants={overlayVariants.morph}
              initial="initial"
              animate="animate"
            />
            
            {/* Orbiting particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: `hsl(var(--${i % 2 === 0 ? 'p' : 's'}))`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 50px'
                }}
                initial={{ 
                  rotate: i * 60, 
                  x: 0, 
                  y: -80,
                  scale: 0
                }}
                animate={{ 
                  rotate: i * 60 + 720,
                  x: [0, 30, 0],
                  y: [-80, -120, -200],
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </div>
    </AnimatePresence>
  )
}

export const useTheme = () => useContext(ThemeContext)
