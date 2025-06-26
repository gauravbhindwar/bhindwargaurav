'use client'

import { motion } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'

export default function Hero() {
  const { reducedMotion } = useTheme()
  
  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Enhanced background that's vibrant in dark theme */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay - significantly more vibrant in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/8 to-accent/12 
                        dark:from-primary/35 dark:via-secondary/20 dark:to-accent/30" />
        
        {/* Animated dot pattern - more prominent in dark mode */}
        <motion.div 
          className="absolute inset-0 opacity-20 dark:opacity-60"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--p) / 0.15) 1.5px, transparent 1.5px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Additional vibrant overlay - much more vibrant for dark theme */}
        <div className="absolute inset-0 bg-gradient-to-tr from-success/8 via-transparent to-warning/8 
                        dark:from-success/25 dark:via-info/15 dark:to-warning/25" />
        
        {/* Theme-adaptive enhancement layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-100/20 via-transparent to-base-100/10 
                        dark:from-base-200/15 dark:via-transparent dark:to-base-300/15" />
      </div>
      
      {/* Main content - shifted down with more spacing */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 md:py-20">
        {/* Enhanced hero card with proper theme support for both light and dark */}
        <motion.div 
          className="bg-base-100/95 backdrop-blur-lg rounded-3xl border border-base-300/70 
                     p-10 lg:p-16 xl:p-20 shadow-2xl max-w-8xl mx-auto hover:shadow-3xl 
                     transition-all duration-500 backdrop-saturate-150 min-h-[80vh]
                     ring-1 ring-base-300/30
                     dark:bg-base-100/90 dark:border-base-300/80 dark:shadow-2xl 
                     dark:hover:shadow-primary/40 dark:hover:shadow-3xl
                     dark:backdrop-blur-xl dark:backdrop-saturate-200
                     dark:ring-1 dark:ring-primary/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -8 }}
        ><div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text content - takes more space on larger screens */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Enhanced greeting with vibrant colors and larger size */}
              <div className="flex justify-center items-center lg:justify-start">
                <motion.div 
                  className="inline-flex items-center text-xl font-bold text-base-content 
                            bg-gradient-to-r from-primary/30 to-secondary/20 px-8 py-5 rounded-2xl mb-8 
                            border-2 border-primary/50 backdrop-blur-lg shadow-xl
                            dark:bg-gradient-to-r dark:from-primary/60 dark:to-secondary/40 
                            dark:border-primary/80 dark:text-primary-content 
                            dark:shadow-primary/40 dark:backdrop-blur-2xl
                            hover:bg-gradient-to-r hover:from-primary/40 hover:to-secondary/30
                            dark:hover:from-primary/70 dark:hover:to-secondary/50 
                            transition-all duration-300 ring-2 ring-primary/20 dark:ring-primary/40"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className="drop-shadow-sm">Hello, I'm</span>
                </motion.div>
              </div>
              
              {/* Professional main heading that adapts to theme */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-base-content leading-tight">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-primary font-extrabold">Gaurav Kumar</span>
                  </motion.div>
                </h1>

                {/* Professional role description that adapts to theme */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl text-base-content/80 font-light"
                >
                  <ReactTyped
                    strings={[
                      'Senior Software Engineer',
                      'Full-Stack Developer',
                      'Data Science Engineer',
                      'AI/ML Specialist',
                      'Technical Architect'
                    ]}
                    typeSpeed={80}
                    backSpeed={50}
                    loop
                    className="text-secondary font-medium"
                  />
                </motion.div>
              </div>
              
              {/* Professional bio description */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.p 
                  className="text-lg text-base-content/70 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  Experienced software engineer with a proven track record in building scalable web applications 
                  and implementing cutting-edge AI solutions. Specialized in full-stack development with the{' '}
                  <span className="text-primary font-semibold">MERN stack</span> and{' '}
                  <span className="text-secondary font-semibold">Next.js</span>, 
                  with expertise in{' '}
                  <span className="text-accent font-semibold">machine learning</span> and{' '}
                  <span className="text-info font-semibold">data science</span>.
                </motion.p>

                {/* Enhanced skill badges with vibrant dark theme support */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  {[
                    'Full-Stack Development',
                    'Machine Learning',
                    'Cloud Architecture',
                    'DevOps',
                    'Team Leadership'
                  ].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-2 bg-base-200/90 text-base-content rounded-full text-sm font-medium 
                                border border-base-300/60 hover:border-primary/60 hover:bg-primary/15 
                                transition-all duration-300 backdrop-blur-sm
                                dark:bg-base-200/95 dark:border-base-300/90 dark:hover:bg-primary/25
                                dark:hover:border-primary/80 dark:shadow-sm dark:hover:shadow-primary/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + (index * 0.1) }}
                      whileHover={{ 
                        y: -2, 
                        scale: 1.05,
                        boxShadow: '0 5px 15px -5px hsl(var(--primary) / 0.4)'
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Professional CTA buttons with vibrant dark theme */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-content 
                              rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 
                              shadow-lg hover:shadow-xl min-w-[160px]
                              dark:shadow-primary/30 dark:hover:shadow-primary/50 dark:hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get in Touch
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                  
                  <motion.a
                    href="#projects"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary 
                              text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-content 
                              transition-all duration-300 min-w-[160px]
                              dark:border-primary/90 dark:hover:border-primary dark:text-primary 
                              dark:hover:shadow-primary/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Portfolio
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.a>
                  
                  <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 bg-base-200/90 
                              text-base-content rounded-lg font-medium hover:bg-base-300/90 
                              transition-all duration-300 border border-base-300/60 min-w-[160px]
                              backdrop-blur-sm
                              dark:bg-base-200/95 dark:border-base-300/90 dark:hover:bg-base-300/95
                              dark:shadow-sm dark:hover:shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download CV
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Professional profile image with enhanced dark theme */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                {/* Clean, professional image container with vibrant dark theme adaptation */}
                <motion.div 
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden 
                            border-4 border-primary/20 shadow-2xl bg-gradient-to-br from-primary/5 to-secondary/5
                            ring-1 ring-base-300/20
                            dark:border-primary/40 dark:shadow-primary/20 dark:shadow-2xl 
                            dark:bg-gradient-to-br dark:from-primary/10 dark:to-secondary/10
                            dark:ring-primary/20"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 25px 50px -12px hsl(var(--shadow) / 0.25)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/gaurav.jpg"
                    alt="Gaurav Kumar - Software Engineer"
                    fill
                    priority
                    sizes="(max-width: 768px) 320px, 384px"
                    className="object-cover"
                  />
                  
                  {/* Professional overlay gradient - enhanced for dark theme */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent 
                                  dark:from-primary/20 dark:via-transparent dark:to-transparent" />
                </motion.div>

                {/* Floating professional badges with enhanced dark theme */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-primary text-primary-content 
                            px-4 py-2 rounded-full text-sm font-medium shadow-lg
                            dark:shadow-primary/30 dark:shadow-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Available for Work
                </motion.div>
{/* 
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-secondary text-secondary-content 
                            px-4 py-2 rounded-full text-sm font-medium shadow-lg
                            dark:shadow-secondary/30 dark:shadow-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  5+ Years Experience
                </motion.div> */}
              </div>
            </motion.div>
          </div>
          
          {/* Professional achievements section with enhanced dark theme */}
          {/* <motion.div
            className="mt-12 pt-8 border-t border-base-300/50 dark:border-base-300/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-base-content/60 dark:text-base-content/80 mt-1">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-secondary">5+</div>
                <div className="text-sm text-base-content/60 dark:text-base-content/80 mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-accent">15+</div>
                <div className="text-sm text-base-content/60 dark:text-base-content/80 mt-1">Technologies</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-info">24/7</div>
                <div className="text-sm text-base-content/60 dark:text-base-content/80 mt-1">Support Available</div>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  )
}
