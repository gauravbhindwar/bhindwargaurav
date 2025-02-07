'use client'

import { motion } from 'framer-motion'
import skillsData from '@/data/skills.json'
import * as SimpleIcons from 'simple-icons'
import { useTheme } from '@/components/theme-provider'

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-center mb-16">
            <span className="warm-gradient">Technical Arsenal</span>
          </h2>

          <TechnicalSkills />
        </motion.div>
      </div>
    </section>
  )
}

function TechnicalSkills() {
  return (
    <div className="space-y-12">
      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsData.categories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <div className="h-full bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                          border border-base-content/5 hover:border-primary/20 transition-all duration-300
                          hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
              <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, index) => (
                  <SkillBadge key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Courses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {['Current', 'Completed'].map((type, idx) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                      border border-base-content/5 hover:border-primary/20 transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
          >
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {type} Coursework
            </h3>
            <div className="flex flex-wrap gap-3">
              {skillsData.courses[type.toLowerCase()].map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="px-4 py-2 rounded-full bg-base-100/50 border border-base-content/5 
                                hover:border-primary/20 hover:bg-base-200/50 transition-all duration-300 
                                hover:scale-105 hover:shadow-lg">
                    <span className="text-sm font-medium">{course}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SkillBadge({ skill, index }) {
  const iconName = skill.icon || skill.name.replace(/\s+/g, '').toLowerCase()
  let Icon
  
  try {
    Icon = SimpleIcons[`si${iconName.charAt(0).toUpperCase() + iconName.slice(1)}`]
  } catch (e) {
    Icon = null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 border border-base-content/5 
                    hover:border-primary/20 hover:bg-base-200/50 transition-all duration-300 
                    hover:scale-105 hover:shadow-lg">
        {Icon && (
          <svg
            className="w-4 h-4 text-primary group-hover:text-secondary transition-colors duration-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={Icon.path} />
          </svg>
        )}
        <span className="text-sm font-medium">{skill.name}</span>
      </div>
    </motion.div>
  )
}
