'use client'

import { useTheme } from './theme-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaSun, FaMoon, FaMusic, FaFileDownload } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import useFetch from '@/hooks/useFetch'

// Custom hook for section detection
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const updateActiveSection = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + window.innerHeight / 2 // Use middle of viewport

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight
        
        // Check if section is in view with more precise boundaries
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          // Special handling for last section (contact)
          if (section.id === 'contact' && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
            setActiveSection('contact')
          } else {
            setActiveSection(section.id)
          }
        }
      })
    }

    // Call on mount and scroll
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    
    // Also update on window resize
    window.addEventListener('resize', updateActiveSection, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return activeSection
}

const AnimatedNotes = () => (
  <div className="flex justify-center gap-1">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0, 1, 0],
          y: [-10, -20],
          x: [0, i === 0 ? -5 : i === 2 ? 5 : 0]
        }}
        transition={{
          duration: 2,
          delay: i * 0.2,
          repeat: Infinity,
          repeatDelay: 0.5
        }}
      >
        <FaMusic className="text-primary w-3 h-3" />
      </motion.div>
    ))}
  </div>
)

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState('')
  const { data: contactData, loading, error } = useFetch('/api/contact')

  const navItems = [
    { href: '#projects', label: 'Projects', id: 'projects' },
    { href: '#skills', label: 'Skills', id: 'skills' },
    { href: '#certifications', label: 'Certifications', id: 'certifications' },
    { href: '#contact', label: 'Contact', id: 'contact' }
  ]

  const downloadResume = () => {
    // Use the resume link from contact data with error handling
    if (contactData && contactData.resumeLink) {
      window.open(contactData.resumeLink, '_blank', 'noopener,noreferrer')
    } else if (!loading && !error) {
      // If not loading and no error but still no data
      console.warn('Resume link not available')
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalScroll) * 100
      setScrollProgress(currentProgress)
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault();
    
    setIsOpen(false);
    
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        const sectionId = href.replace('#', '');
        setCurrentSection(sectionId);
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection)
    }
  }, [activeSection])

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-red-600"
          style={{ width: `${scrollProgress}%`, filter: 'blur(1px)' }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </motion.div>

      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 ${
          isScrolled ? 'py-2 bg-base-100/80 backdrop-blur-md shadow-lg shadow-purple-900/10 border-b border-purple-900/20' : 'py-4 bg-transparent'
        } transition-all duration-200 ease-in-out`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between relative">
            <motion.a 
              href="#home"
              className="text-xl md:text-lg lg:text-xl font-bold relative group shrink-0"
              whileHover={{ scale: 1.05 }}
              onClick={(e) => handleNavClick(e, '#home')}
            >
              {/* <span className="bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text">
                Gaurav
              </span> */}
              {currentSection === 'home' && <AnimatedNotes />}
            </motion.a>

            <div className="hidden lg:flex items-center gap-8">
              <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-1.5">
                <ul className="flex items-center gap-1 relative">
                  {navItems.map((item) => (
                    <motion.li key={item.id}>
                      <a 
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="relative px-4 py-2 rounded-xl block transition-all"
                      >
                        <AnimatePresence mode="wait">
                          {currentSection === item.id && (
                            <motion.span
                              layoutId="navActive"
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </AnimatePresence>
                        <span className={`relative z-10 transition-colors duration-200 ${
                          currentSection === item.id 
                            ? 'text-primary font-medium' 
                            : 'hover:text-primary/70'
                        }`}>
                          {item.label}
                        </span>
                        {currentSection === item.id && (
                          <motion.div 
                            className="absolute -bottom-4 left-0 right-0"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <AnimatedNotes />
                          </motion.div>
                        )}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.button 
                onClick={downloadResume}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 text-white flex items-center gap-2 text-sm overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !contactData}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600/50 via-purple-600/50 to-red-600/50 blur-xl"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <FaFileDownload className="w-4 h-4" />
                  )}
                  <span className="font-medium">Resume</span>
                </div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                />
              </motion.button>

              <motion.button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotateZ: -45 }}
                    animate={{ opacity: 1, rotateZ: 0 }}
                    exit={{ opacity: 0, rotateZ: 45 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <FaSun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <FaMoon className="w-5 h-5 text-slate-600" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>

            <motion.button 
              className="lg:hidden p-2 rounded-xl hover:bg-base-200/50 ml-auto menu-button"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden fixed inset-x-0 top-[60px] bg-base-100/95 backdrop-blur-md border-b border-base-200/50 shadow-lg mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ 
                maxHeight: 'calc(100vh - 60px)',
                overflowY: 'auto',
                zIndex: 40
              }}
            >
              <div className="p-4">
                <ul className="space-y-3">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl relative ${
                          currentSection === item.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-base-200/70'
                        }`}
                      >
                        <span className="text-lg">{item.label}</span>
                        {currentSection === item.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <AnimatedNotes />
                          </motion.div>
                        )}
                      </a>
                    </motion.li>
                  ))}

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 0.1) * 0.1 }}
                  >
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-base-200/70"
                    >
                      <span className="text-lg">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-2 bg-base-200/50 rounded-lg"
                      >
                        {theme === 'dark' ? (
                          <FaSun className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <FaMoon className="w-5 h-5 text-slate-600" />
                        )}
                      </motion.div>
                    </button>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 0.2) * 0.1 }}
                  >
                    <button
                      onClick={downloadResume}
                      disabled={loading || !contactData}
                      className="relative w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 text-white overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-600/50 via-purple-600/50 to-red-600/50 blur-xl"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <span className="relative z-10 text-lg font-medium">Download Resume</span>
                      <motion.div 
                        className="relative z-10 p-2 bg-white/10 backdrop-blur-sm rounded-lg"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <FaFileDownload className="w-5 h-5" />
                        )}
                      </motion.div>
                      
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1
                        }}
                      />
                    </button>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
