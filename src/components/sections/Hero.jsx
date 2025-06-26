'use client'

import { motion } from 'framer-motion'
import { useTheme } from '../theme-provider'
import Image from 'next/image'
import { ReactTyped } from 'react-typed'
import useFetch from '@/hooks/useFetch'

export default function Hero() {
  const { reducedMotion } = useTheme()
  const { data: contactData, loading: contactLoading } = useFetch('/api/contact')
  
  const transition = {
    type: reducedMotion ? "tween" : "spring",
    duration: reducedMotion ? 0.15 : 0.5,
    stiffness: 260,
    damping: 20
  }
  return (
    <section id="home" className="relative min-h-screen bg-base-100">
      {/* Clean professional background */}
      <div className="absolute inset-0">
        {/* Subtle geometric pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--bc) / 0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Minimal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-base-100/50 via-transparent to-base-200/30" />
      </div>
      
      {/* Main content - shifted down with more spacing */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 md:py-20">
        {/* Professional hero card with clean design */}
        <motion.div 
          className="bg-base-100/95 backdrop-blur-sm rounded-2xl border border-base-300/30 
                     p-8 lg:p-12 xl:p-16 shadow-lg max-w-7xl mx-auto hover:shadow-xl 
                     transition-all duration-300 min-h-[75vh]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -4 }}
        ><div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text content - takes more space on larger screens */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Clean professional greeting */}
              <div className="flex justify-center items-center lg:justify-start">
                <motion.div 
                  className="inline-flex items-center text-lg font-semibold text-base-content 
                            bg-base-200/50 px-6 py-3 rounded-xl mb-6 
                            border border-base-300/50 backdrop-blur-sm shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                >
                  <span>Hello, I'm</span>
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
                      'Full-Stack Developer',
                      'Data Science and Machine Learning Enthusiast',
                      'Technical Architect',
                      'Software Architect',
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
                  <span className="text-accent font-semibold">artificial intelligence</span>, 
                  <span className="text-success font-semibold">data science</span>, and
                  <span className="text-info font-semibold">RAG</span>
                </motion.p>

                {/* Clean skill badges */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  {[
                    'Full-Stack Development',
                    'Machine Learning',
                    'Data Science',
                    'RAG',
                    'Team Leadership'
                  ].map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="px-4 py-2 bg-base-200/80 text-base-content rounded-full text-sm font-medium 
                                border border-base-300/50 hover:border-primary/50 hover:bg-primary/10 
                                transition-all duration-200 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + (index * 0.1) }}
                      whileHover={{ 
                        y: -1, 
                        scale: 1.02
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Clean CTA buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-content 
                              rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 
                              shadow-md hover:shadow-lg min-w-[160px]"
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
                              transition-all duration-200 min-w-[160px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Portfolio
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.a>
                  
                  <motion.a
                    href={contactData?.resumeLink || "/resume.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 bg-base-200/80 
                              text-base-content rounded-lg font-medium hover:bg-base-300/80 
                              transition-all duration-200 border border-base-300/50 min-w-[160px]
                              backdrop-blur-sm
                              disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ pointerEvents: contactLoading ? 'none' : 'auto' }}
                    whileHover={{ scale: contactLoading ? 1 : 1.02 }}
                    whileTap={{ scale: contactLoading ? 1 : 0.98 }}
                  >
                    {contactLoading ? 'Loading...' : 'Download CV'}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Clean professional profile image */}
            <motion.div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative">
                {/* Professional image container */}
                <motion.div 
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden 
                            border-2 border-base-300/30 shadow-lg bg-base-200/20"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 20px 40px -12px hsl(var(--shadow) / 0.25)'
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
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-base-content/5 via-transparent to-transparent" />
                </motion.div>

                {/* Clean professional badge */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-primary text-primary-content 
                            px-4 py-2 rounded-full text-sm font-medium shadow-lg"
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
