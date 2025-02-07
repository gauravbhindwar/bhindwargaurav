'use client'

import { motion } from 'framer-motion'
import contactData from '@/data/contact.json'
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'

const socialIcons = {
  github: FaGithub,
  linkedin: FaLinkedin,
}

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-12">
            <span className="text-gradient">Let&apos;s Connect</span>
          </h2>

          <div className="space-y-12">
            {/* Contact Information */}
            <div className="prose max-w-none">
              <p className="text-xl text-base-content/80">
                I&apos;m always interested in hearing about new projects and opportunities.
                Feel free to reach out!
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-6 h-6 text-primary" />
                <a href={`mailto:${contactData.email}`} className="link link-hover text-lg">
                  {contactData.email}
                </a>
              </div>
              {contactData.phone && (
                <div className="flex items-center gap-3">
                  <FaPhone className="w-6 h-6 text-primary" />
                  <span className="text-lg">{contactData.phone}</span>
                </div>
              )}
              {contactData.location && (
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="w-6 h-6 text-primary" />
                  <span className="text-lg">{contactData.location}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6">
              {Object.entries(contactData.social).map(([platform, url]) => {
                const Icon = socialIcons[platform]
                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-circle btn-outline btn-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
