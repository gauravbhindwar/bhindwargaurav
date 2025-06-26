'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import emailjs from '@emailjs/browser'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

// Set up EmailJS with environment variables
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState(null) // 'success', 'error', 'submitting', or null
  const [fieldErrors, setFieldErrors] = useState({})
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" })
  
  const { data: contactData, loading, error } = useFetch('/api/contact', {
    revalidate: 3600000 // 1 hour cache
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Clear error when user types in a field
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      })
    }
    
    setFormState({
      ...formState,
      [name]: value
    })
  }

  const validateForm = () => {
    const errors = {}
    
    // Name validation
    if (!formState.name.trim()) {
      errors.name = 'Name is required'
    }
    
    // Email validation
    if (!formState.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    // Message validation
    if (!formState.message.trim()) {
      errors.message = 'Message is required'
    } else if (formState.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Form validation
    if (!validateForm()) {
      setFormStatus('error')
      return
    }
    
    try {
      setFormStatus('submitting')
      
      // Using EmailJS for free email sending
      const templateParams = {
        name: formState.name,           // Changed from_name to name to match your template
        email: formState.email,         // Changed from_email to email to match your template
        message: formState.message,
        title: `Contact Us: Message from ${formState.name}`, // Adding title parameter for email subject
        // No need for to_name as it's predefined in your template
      }
      
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID, 
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      
      setFormStatus('success')
      setFormState({ name: '', email: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus(null), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormStatus('error')
    }
  }

  if (loading) {
    return (
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <div className="animate-pulse">
                <div className="h-12 bg-base-300 rounded-lg w-1/3 mx-auto mb-12"></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="h-8 bg-base-300 rounded-lg w-3/4"></div>
                    <div className="h-8 bg-base-300 rounded-lg w-1/2"></div>
                    <div className="h-8 bg-base-300 rounded-lg w-2/3"></div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="h-12 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-12 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-32 bg-base-300 rounded-lg w-full"></div>
                    <div className="h-12 bg-base-300 rounded-lg w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !contactData) {
    return (
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-error mb-4">Unable to load contact information</h2>
                <p className="text-base-content/70">Please try again later or contact me directly via email.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  // Configure EmailJS
  if (typeof window !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  }

  return (
    <section id="contact" className="py-24 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
      
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px'],
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
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-12 
                        border border-base-content/5 hover:border-primary/20 transition-all duration-300
                        hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
            <motion.h2 
              className="text-5xl font-bold text-center mb-16"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Let&apos;s Connect</span>
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="relative">
                  <p className="text-lg text-base-content/80 leading-relaxed mb-6">
                    I&apos;m always interested in hearing about new projects, opportunities, 
                    or just connecting with fellow developers and tech enthusiasts.
                  </p>
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: "30%" }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>

                <div className="space-y-5">
                  <motion.div 
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-base-100/50 border border-base-content/5 
                             hover:border-primary/20 hover:bg-base-100/80 transition-all duration-300 hover:shadow-lg"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <FaEnvelope className="w-5 h-5 text-primary" />
                    </div>
                    <a href={`mailto:${contactData.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                      {contactData.email}
                    </a>
                  </motion.div>
                  
                  {contactData.phone && (
                    <motion.div 
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-base-100/50 border border-base-content/5 
                               hover:border-secondary/20 hover:bg-base-100/80 transition-all duration-300 hover:shadow-lg"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <FaPhone className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-lg font-medium">{contactData.phone}</span>
                    </motion.div>
                  )}
                </div>

                <div className="mt-8">
                  <motion.h3 
                    className="text-xl font-bold mb-4 flex items-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Connect with me</span>
                  </motion.h3>
                  
                  <div className="flex gap-4">
                    {Object.entries(contactData.social).map(([platform, url], index) => {
                      const Icon = socialIcons[platform]
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 rounded-2xl bg-base-100/50 border border-base-content/5 flex items-center justify-center
                                   hover:border-primary/20 hover:bg-primary/10 hover:scale-110 transition-all duration-300
                                   hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          whileInView={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            transition: { 
                              delay: 0.7 + (index * 0.1),
                              type: "spring",
                              stiffness: 260,
                              damping: 20
                            } 
                          }}
                          whileTap={{ scale: 0.95 }}
                          viewport={{ once: true }}
                        >
                          {Icon && <Icon className="w-6 h-6 text-primary" />}
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute top-2 left-4 text-6xl text-primary/20 font-serif leading-none">"</div>
                  <blockquote className="text-base-content/80 italic text-lg leading-relaxed pt-4">
                    Great things happen when we collaborate. 
                    Let's build something amazing together!
                  </blockquote>
                  <div className="text-right mt-4 font-medium text-primary">– {contactData.name || 'Gaurav'}</div>
                </motion.div>
              </motion.div>

              {/* Contact Form Side */}
              <div ref={formRef}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-base-100/70 backdrop-blur-sm rounded-2xl p-8 border border-base-content/20 shadow-xl"
                >
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Send me a message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-base-content">
                        <span>Your Name</span>
                        {fieldErrors.name && (
                          <span className="text-error text-xs flex items-center gap-1">
                            <FaExclamationCircle />
                            {fieldErrors.name}
                          </span>
                        )}
                      </label>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 transition-all duration-300
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                                   hover:bg-base-300 text-base-content placeholder-base-content/50
                                   ${fieldErrors.name ? 'border-error focus:ring-error focus:border-error' : 'border-base-content/20'}`}
                          disabled={formStatus === 'submitting'}
                        />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-base-content">
                        <span>Email</span>
                        {fieldErrors.email && (
                          <span className="text-error text-xs flex items-center gap-1">
                            <FaExclamationCircle />
                            {fieldErrors.email}
                          </span>
                        )}
                      </label>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="johndoe@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 transition-all duration-300
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                                   hover:bg-base-300 text-base-content placeholder-base-content/50
                                   ${fieldErrors.email ? 'border-error focus:ring-error focus:border-error' : 'border-base-content/20'}`}
                          disabled={formStatus === 'submitting'}
                        />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm font-medium text-base-content">
                        <span>Message</span>
                        {fieldErrors.message && (
                          <span className="text-error text-xs flex items-center gap-1">
                            <FaExclamationCircle />
                            {fieldErrors.message}
                          </span>
                        )}
                      </label>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          placeholder="I'd like to discuss a project..."
                          className={`w-full px-4 py-3 rounded-xl bg-base-200 border-2 transition-all duration-300
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                                   hover:bg-base-300 resize-none text-base-content placeholder-base-content/50
                                   ${fieldErrors.message ? 'border-error focus:ring-error focus:border-error' : 'border-base-content/20'}`}
                          disabled={formStatus === 'submitting'}
                          rows={6}
                        ></textarea>
                      </motion.div>
                    </div>
                    
                    {formStatus === 'error' && !Object.keys(fieldErrors).length && (
                      <motion.div 
                        className="flex items-center gap-2 p-4 rounded-xl bg-error/10 border border-error/30 text-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FaExclamationCircle className="w-5 h-5" />
                        <span>There was a problem sending your message. Please try again.</span>
                      </motion.div>
                    )}
                    
                    {formStatus === 'success' && (
                      <motion.div 
                        className="flex items-center gap-2 p-4 rounded-xl bg-success/10 border border-success/30 text-success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FaCheckCircle className="w-5 h-5" />
                        <span>Your message has been sent successfully!</span>
                      </motion.div>
                    )}
                    
                    <motion.button
                      type="submit"
                      className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-content 
                               font-bold text-lg hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] 
                               hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:scale-100 disabled:hover:shadow-none
                               flex items-center justify-center gap-3 border-2 border-primary/20"
                      disabled={formStatus === 'submitting'}
                      whileHover={formStatus !== 'submitting' ? { scale: 1.02 } : {}}
                      whileTap={formStatus !== 'submitting' ? { scale: 0.98 } : {}}
                    >
                      {formStatus === 'submitting' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <>
                          <FaPaperPlane className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                  
                  <div className="mt-6 pt-4 border-t border-base-content/10 text-center">
                    <p className="text-sm text-base-content/60">
                      🔒 Your data is handled securely and I'll never share it with third parties.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
