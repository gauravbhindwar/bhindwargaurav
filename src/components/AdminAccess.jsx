'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaCog, FaTimes, FaKeyboard } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminAccess() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showKeyboardHint, setShowKeyboardHint] = useState(false)
  const router = useRouter()

  // Keyboard shortcut: Ctrl/Cmd + Shift + A
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        router.push('/admin/login')
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [router])

  // Show keyboard hint briefly after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowKeyboardHint(true)
      setTimeout(() => setShowKeyboardHint(false), 3000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Floating Admin Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }} // Appear after page loads
      >
        <motion.button
          className="bg-gray-800/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-gray-700/90 transition-all duration-300"
          onClick={() => setIsVisible(!isVisible)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isVisible ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isVisible ? <FaTimes className="w-4 h-4" /> : <FaCog className="w-4 h-4" />}
          </motion.div>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isVisible && (
            <motion.div
              className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              Admin Access
              <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keyboard Shortcut Hint */}
      <AnimatePresence>
        {showKeyboardHint && (
          <motion.div
            className="fixed bottom-20 right-4 z-40 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <FaKeyboard className="w-3 h-3" />
              <span>Press Ctrl+Shift+A for Admin</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-20 right-4 z-40 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Admin Panel</h3>
              
              <div className="space-y-2">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => setIsVisible(false)}
                >
                  <FaCog className="w-3 h-3" />
                  Admin Login
                </Link>
                
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Access the admin dashboard to manage portfolio content, projects, skills, and certifications.
                  </p>
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center gap-1">
                    <FaKeyboard className="w-3 h-3" />
                    <span>Shortcut: Ctrl+Shift+A</span>
                  </div>
                  <div>
                    <p>Need admin access?</p>
                    <code className="bg-gray-100 px-1 rounded text-xs">npm run create-admin</code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  )
}
