'use client'

import { motion } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
import AnimatedLetters from './AnimatedLetters'
import styles from './Hero.module.css'
export default function Hero() {
  const { reducedMotion } = useTheme()

  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center pt-28 sm:pt-32 md:pt-28 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent" />
        <motion.div 
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
            opacity: [0.1, 0.15]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--p)) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-5 lg:col-span-5 order-1 lg:order-2 -mt-12 sm:-mt-8 md:mt-0"
          >
            <motion.div
              className={`relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-80 lg:h-80 mx-auto ${styles.profileImageContainer} ${styles.floatingAnimation}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Glow Effect */}
              <div className={`${styles.glowEffect} hidden sm:block`} />
              
              {/* Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 rounded-full blur-xl sm:blur-2xl opacity-40 sm:opacity-20"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Profile Image */}
              <motion.div
                className="relative w-full h-full rounded-full border-4 border-base-content/10 overflow-hidden"
                whileHover={{ scale: 1.1 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image
                  src="/gaurav.jpg"
                  alt="Profile"
                  fill
                  priority
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 256px, 320px"
                  className="object-cover"
                />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div                className="absolute -bottom-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 bg-dots-pattern opacity-20 hidden sm:block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-dots-pattern opacity-20 hidden sm:block"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="md:col-span-7 lg:col-span-7 text-center md:text-left space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1 relative"
          >
            {/* Lamp Effect */}
            <motion.div
              className="absolute -top-[150%] left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                background: 'radial-gradient(circle, hsl(var(--p)/0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
                zIndex: -1,
              }}
            />
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className="h-1 bg-gradient-to-r from-primary to-secondary mx-auto md:mx-0"
            />

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-4 text-lg sm:text-xl md:text-2xl text-primary font-display tracking-wide"
              >
                <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Hello</span>
                <span className="font-semibold">World</span>
                <span className="text-2xl sm:text-3xl md:text-4xl">👋</span>
              </motion.div>

              <motion.div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight">
                  <span className="block">I&apos;m</span>
                  <span className="block bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                    <AnimatedLetters text="Gaurav Kumar" />
                  </span>
                </h1>
                
                <motion.div 
                  className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-2 sm:gap-4 text-lg sm:text-xl md:text-2xl text-base-content/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="font-semibold">Passionate</span>
                  <ReactTyped
                    strings={[
                      'Software Engineer',
                      'Full Stack Web Developer',
                      'MERN Stack Developer',
                      'Next.js Developer'
                    ]}
                    typeSpeed={40}
                    backSpeed={30}                    loop
                    className="text-accent font-bold font-sans"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.p 
              className="text-base sm:text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto md:mx-0 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Building user-friendly applications with modern web technologies, specializing in MERN stack and Next.js.
            </motion.p>       
          </motion.div>
        </div>
      </div>
    </section>
  )
}
