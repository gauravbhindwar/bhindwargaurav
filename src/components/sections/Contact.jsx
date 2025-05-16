'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import styles from './Contact.module.css'
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
      <section id="contact" className={`py-20 ${styles.contactSection}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className={styles.gradientBg} />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className={styles.contactCard}>
              <div className="p-8 animate-pulse">
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
      <section id="contact" className={`py-20 ${styles.contactSection}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
        <div className={styles.gradientBg} />
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className={styles.contactCard}>
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-error mb-4">Unable to load contact information</h2>
                <p>Please try again later or contact me directly via email.</p>
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
    <section id="contact" className={`py-20 ${styles.contactSection}`}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.07]" />
      <div className={styles.gradientBg} />
      <motion.div 
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px'],
          opacity: [0.07, 0.12]
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
      
      {/* Animated particles in background */}
      <motion.div className={styles.particles}>
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className={styles.particle}
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              x: [
                Math.random() * 100 - 50 + "%", 
                Math.random() * 100 - 50 + "%", 
                Math.random() * 100 - 50 + "%"
              ],
              y: [
                Math.random() * 100 + "%", 
                Math.random() * 100 + "%", 
                Math.random() * 100 + "%"
              ],
              opacity: [0.1, Math.random() * 0.3 + 0.1, 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <div className={styles.contactCard}>
            <motion.h2 
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className={styles.gradientText}>Let&apos;s Connect</span>
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
                <div className={styles.introText}>
                  <p>
                    I&apos;m always interested in hearing about new projects, opportunities, 
                    or just connecting with fellow developers and tech enthusiasts.
                  </p>
                  <motion.div 
                    className={styles.divider}
                    initial={{ width: "30%" }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>

                <div className="space-y-5">
                  <motion.div 
                    className={styles.contactItem}
                    whileHover={{ x: 5 }}
                  >
                    <div className={`${styles.iconWrapper} ${styles.iconWrapperPrimary}`}>
                      <FaEnvelope className="w-5 h-5" />
                    </div>
                    <a href={`mailto:${contactData.email}`} className={styles.contactText}>
                      {contactData.email}
                    </a>
                  </motion.div>
                  
                  {contactData.phone && (
                    <motion.div 
                      className={styles.contactItem}
                      whileHover={{ x: 5 }}
                    >
                      <div className={`${styles.iconWrapper} ${styles.iconWrapperSecondary}`}>
                        <FaPhone className="w-5 h-5" />
                      </div>
                      <span className={styles.contactText}>{contactData.phone}</span>
                    </motion.div>
                  )}
                </div>

                <div className={styles.socialSection}>
                  <motion.h3 
                    className={styles.socialTitle}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Connect with me
                  </motion.h3>
                  
                  <div className={styles.socialButtons}>
                    {Object.entries(contactData.social).map(([platform, url], index) => {
                      const Icon = socialIcons[platform]
                      return (
                        <motion.a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialButton}
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
                          whileHover={{ 
                            scale: 1.1,
                            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          viewport={{ once: true }}
                        >
                          {Icon && <Icon className="w-6 h-6" />}
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
                
                <motion.div 
                  className={styles.quoteContainer}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.quoteMark}>"</div>
                  <blockquote className={styles.quote}>
                    Great things happen when we collaborate. 
                    Let's build something amazing together!
                  </blockquote>
                  <div className={styles.quoteAuthor}>– {contactData.name || 'Gaurav'}</div>
                </motion.div>
              </motion.div>

              {/* Contact Form Side */}
              <div ref={formRef}>
                <motion.div
                  initial={{x: 20 }}
                  animate={isFormInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className={styles.formContainer}
                >
                  <h3 className={styles.formTitle}>Send me a message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span>Your Name</span>
                        {fieldErrors.name && (
                          <span className={styles.errorText}>
                            <FaExclamationCircle className="inline mr-1" />
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
                          className={`${styles.formInput} ${fieldErrors.name ? styles.inputError : ''}`}
                          disabled={formStatus === 'submitting'}
                        />
                      </motion.div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span>Email</span>
                        {fieldErrors.email && (
                          <span className={styles.errorText}>
                            <FaExclamationCircle className="inline mr-1" />
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
                          className={`${styles.formInput} ${fieldErrors.email ? styles.inputError : ''}`}
                          disabled={formStatus === 'submitting'}
                        />
                      </motion.div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        <span>Message</span>
                        {fieldErrors.message && (
                          <span className={styles.errorText}>
                            <FaExclamationCircle className="inline mr-1" />
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
                          className={`${styles.formTextarea} ${fieldErrors.message ? styles.inputError : ''}`}
                          disabled={formStatus === 'submitting'}
                          rows={6}
                        ></textarea>
                      </motion.div>
                    </div>
                    
                    {formStatus === 'error' && !Object.keys(fieldErrors).length && (
                      <motion.div 
                        className={styles.errorAlert}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FaExclamationCircle className="w-5 h-5" />
                        <span>There was a problem sending your message. Please try again.</span>
                      </motion.div>
                    )}
                    
                    {formStatus === 'success' && (
                      <motion.div 
                        className={styles.successAlert}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <FaCheckCircle className="w-5 h-5" />
                        <span>Your message has been sent successfully!</span>
                      </motion.div>
                    )}
                    
                    <motion.button
                      type="submit"
                      className={styles.submitButton}
                      disabled={formStatus === 'submitting'}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {formStatus === 'submitting' ? (
                        <div className={styles.spinnerContainer}>
                          <div className={styles.spinner} />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <>
                          <FaPaperPlane className="mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                  
                  <div className={styles.formFooter}>
                    <p>Your data is handled securely and I'll never share it with third parties.</p>
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
