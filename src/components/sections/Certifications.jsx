'use client'

import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaAward, FaCalendarAlt } from 'react-icons/fa'
import useFetch from '@/hooks/useFetch'
import { CertificationsSkeleton } from '@/components/ui/SkeletonCard'

export default function Certifications() {
  const { data: certificationsData, loading, error } = useFetch('/api/certifications', {
    revalidate: 600000 // 10 minutes cache
  })

  if (loading) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-7xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-center mb-16">
              <span className="warm-gradient">Certifications & Achievements</span>
            </h2>

            <CertificationsSkeleton />
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || !certificationsData) {
    return (
      <section id="certifications" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load certifications data</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="warm-gradient">Certifications & Achievements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {certificationsData.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                              border border-base-content/5 hover:border-primary/20 transition-all duration-300
                              hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FaAward className="w-6 h-6 text-primary" />
                      </div>
                      <a
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary 
                                 hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        Verify <FaExternalLinkAlt className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {cert.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4 text-base-content/70">
                        <span className="font-medium">{cert.issuer}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                        <div className="flex items-center gap-1 text-sm">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>{cert.date}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-base-content/70 mb-6 line-clamp-2">
                        {cert.description}
                      </p>
                      
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.slice(0, 6).map(skill => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-base-100/50 border border-base-content/5 
                                     text-xs font-medium hover:border-primary/20 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 6 && (
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            +{cert.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
