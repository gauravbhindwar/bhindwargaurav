'use client'

import { useTheme } from './theme-provider'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { FaSun, FaMoon, FaMusic, FaFileDownload, FaHome, FaPaintBrush, FaCircle, FaArrowRight, FaStar } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import useFetch from '@/hooks/useFetch'

// Throttle function for performance optimization
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

// Custom hook for section detection
const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('')
  const sectionsRef = useRef([]);
  
  useEffect(() => {
    // Cache all sections to avoid DOM queries on every scroll
    sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
    
    const updateActiveSection = throttle(() => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Use cached sections and find active one
      let currentSection = '';
      
      for (const section of sectionsRef.current) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          // Special handling for last section (contact)
          if (section.id === 'contact' && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
            currentSection = 'contact';
          } else {
            currentSection = section.id;
          }
          break; // Stop the loop when we find the active section
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    }, 100); // 100ms throttle
    
    // Call on mount and scroll
    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    
    // Only update on significant window resize
    const resizeHandler = throttle(() => {
      // Recalculate section positions on resize
      sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
      updateActiveSection();
    }, 250); // 250ms throttle for resize
    
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [activeSection]); // Dependency on activeSection

  return activeSection;
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

// Enhanced Theme Toggle Component with Animation Options
const ThemeToggleWithAnimations = ({ toggleTheme, theme }) => {
  const [showOptions, setShowOptions] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const pressTimer = useRef(null)

  const animationOptions = [
    { 
      type: 'brush', 
      name: 'Brush Paint', 
      icon: FaPaintBrush, 
      color: 'text-orange-500',
      description: 'Paint brush stroke effect'
    },
    { 
      type: 'ripple', 
      name: 'Ripple Wave', 
      icon: FaCircle, 
      color: 'text-blue-500',
      description: 'Expanding ripple circles'
    },
    { 
      type: 'slide', 
      name: 'Slide Panel', 
      icon: FaArrowRight, 
      color: 'text-green-500',
      description: 'Sliding geometric shapes'
    },
    { 
      type: 'morph', 
      name: 'Shape Morph', 
      icon: FaStar, 
      color: 'text-purple-500',
      description: 'Morphing central shape'
    }
  ]

  const handleMouseDown = () => {
    setIsPressed(true)
    pressTimer.current = setTimeout(() => {
      if (isPressed) {
        setShowOptions(true)
      }
    }, 500) // Long press duration
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      if (!showOptions) {
        // Quick click - use default brush animation
        toggleTheme('brush')
      }
    }
  }

  const handleAnimationSelect = (animationType) => {
    setShowOptions(false)
    toggleTheme(animationType)
  }

  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <motion.button 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsPressed(false)
          if (pressTimer.current) clearTimeout(pressTimer.current)
        }}
        className="p-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Long press indicator */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isPressed ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, rotateZ: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotateZ: 0, scale: 1 }}
            exit={{ opacity: 0, rotateZ: 45, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="relative z-10"
          >
            {theme === 'dark' ? (
              <FaSun className="w-5 h-5 text-yellow-400 drop-shadow-sm" />
            ) : (
              <FaMoon className="w-5 h-5 text-slate-600 drop-shadow-sm" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hover hint */}
        <motion.div
          className="absolute -top-2 -right-2 w-2 h-2 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.7, 1, 0.7] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Animation Options Dropdown */}
      <AnimatePresence>
        {showOptions && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOptions(false)}
            />
            
            {/* Options Menu */}
            <motion.div
              className="absolute top-14 right-0 w-72 bg-base-100 rounded-2xl shadow-2xl border border-base-content/10 overflow-hidden z-50"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <div className="p-4">
                <h3 className="text-sm font-semibold text-base-content/80 mb-3 flex items-center gap-2">
                  <FaPaintBrush className="w-4 h-4 text-primary" />
                  Choose Animation Style
                </h3>
                
                <div className="space-y-2">
                  {animationOptions.map((option, index) => (
                    <motion.button
                      key={option.type}
                      onClick={() => handleAnimationSelect(option.type)}
                      className="w-full p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-base-100 ${option.color} group-hover:scale-110 transition-transform`}>
                          <option.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{option.name}</div>
                          <div className="text-xs text-base-content/60">{option.description}</div>
                        </div>
                        <motion.div
                          className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.5 }}
                          transition={{ type: "spring" }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-base-content/10">
                  <p className="text-xs text-base-content/50 text-center">
                    💡 Quick tap for brush effect, long press for options
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState('none') // Track scroll direction
  const [currentSection, setCurrentSection] = useState('')
  const [lastScrollY, setLastScrollY] = useState(0) // Store last scroll position
  const { data: contactData, loading, error } = useFetch('/api/contact')
  const navItems = [
    { href: '#home', label: 'Home', id: 'home', icon: FaHome },
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
    const handleScroll = throttle(() => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (currentScrollY / totalScroll) * 100;
      
      // Determine scroll direction with a small threshold to avoid flickering
      if (currentScrollY > lastScrollY + 5) {
        if (scrollDirection !== 'down') setScrollDirection('down');
      } else if (currentScrollY < lastScrollY - 5) {
        if (scrollDirection !== 'up') setScrollDirection('up');
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
      
      // Only update state if there's a significant change
      setScrollProgress(prev => {
        const diff = Math.abs(prev - currentProgress);
        return diff > 1 ? currentProgress : prev;
      });
      
      // Use a threshold to avoid constant re-renders
      setIsScrolled(currentScrollY > 10);
    }, 50); // 50ms throttle for smooth progress updates

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    // No need for setTimeout, let's do it directly
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      const sectionId = href.replace('#', '');
      setCurrentSection(sectionId);
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      });
    }
  }, []);

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
    <>      <AnimatePresence>
        {scrollDirection === 'down' && (
          <motion.div 
            className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-pink-600 via-purple-600 to-red-600"
              style={{ 
                width: `${scrollProgress}%`, 
                filter: 'blur(1px)' 
              }}
              // Use initial and animate for better performance
              initial={{ width: "0%" }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ 
                duration: 0.1, // Quick but not instant
                ease: "linear"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence><motion.nav 
        className={`fixed top-0 left-0 right-0 z-40 ${
          isScrolled ? 'py-2 backdrop-blur-md shadow-lg shadow-purple-900/5 border-b border-purple-900/10' : 'py-4'
        } transition-transform will-change-transform`}
        style={{
          backgroundColor: isScrolled ? 'var(--b1-a80)' : 'transparent',
          transform: 'translateY(0)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: 'tween', 
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between relative">            <motion.a 
              href="#home"
              className="text-xl md:text-lg lg:text-xl font-bold relative group shrink-0 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              onClick={(e) => handleNavClick(e, '#home')}
            >
              <FaHome className="text-primary w-5 h-5" />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text">
                Gaurav
              </span>
              {currentSection === 'home' && <AnimatedNotes />}
            </motion.a>

            <div className="hidden lg:flex items-center gap-8">
              <div className="bg-base-200/50 backdrop-blur-sm rounded-2xl p-1.5">
                <ul className="flex items-center gap-1 relative">
                  {navItems.map((item) => (
                    <motion.li key={item.id}>                      <a 
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className="relative px-4 py-2 rounded-xl block transition-all"
                      >                      <AnimatePresence mode="wait" initial={false}>
                          {currentSection === item.id && (
                            <motion.span
                              layoutId="navActive"
                              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </AnimatePresence>
                        <div className="relative z-10 flex items-center gap-2">
                          {item.icon && <item.icon className={`w-4 h-4 ${currentSection === item.id ? 'text-primary' : ''}`} />}
                          <span className={`transition-colors duration-200 ${
                            currentSection === item.id 
                              ? 'text-primary font-medium' 
                              : 'hover:text-primary/70'
                          }`}>
                            {item.label}
                          </span>
                        </div>
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

              <ThemeToggleWithAnimations toggleTheme={toggleTheme} theme={theme} />
            </div>            <motion.button 
              className="lg:hidden p-2 rounded-xl hover:bg-base-200/50 ml-auto menu-button"
              onClick={() => setIsOpen(prev => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: isOpen ? 45 : -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isOpen ? -45 : 45 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden fixed inset-x-0 top-[60px] backdrop-blur-md border-b border-base-200/30 shadow-lg mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto', 
                transition: { 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.3 }
                } 
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: { 
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2 }
                }
              }}
              style={{ 
                maxHeight: 'calc(100vh - 60px)',
                overflowY: 'auto',
                zIndex: 40,
                backgroundColor: 'var(--b1-a90)'
              }}
            ><div className="p-4">
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
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon className="w-5 h-5" />}
                          <span className="text-lg">{item.label}</span>
                        </div>
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
                    <div className="px-4 py-2">
                      <ThemeToggleWithAnimations toggleTheme={toggleTheme} theme={theme} />
                    </div>
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
