'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaArrowRight, FaTags, FaChevronDown, FaListUl } from 'react-icons/fa'
import projectsData from '@/data/projects.json'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Add this new component for dynamic project logo
const DynamicLogo = ({ title }) => {
  const initials = title
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
    >
      <div className="h-24 w-24 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
        <span className="text-3xl font-bold text-primary-content">
          {initials}
        </span>
      </div>
    </motion.div>
  )
}

// Modified FeaturesDialog to work with AnimatePresence
const FeaturesDialog = ({ isOpen, onClose, project }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-11/12 max-w-2xl bg-base-200 rounded-2xl p-8"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-primary">{project.title} Features</h3>
            <div className="space-y-4">
              {project.features?.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-primary mt-1">•</span>
                  <p className="text-base-content/80">{feature}</p>
                </motion.div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-base-300/50 hover:bg-base-300"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const [hoveredProject, setHoveredProject] = useState(null)
  const displayedProjects = showAll ? projectsData.projects : projectsData.projects.slice(0, 3)

  return (
    <section id="projects" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div className="max-w-6xl mx-auto">
          {/* Updated Header */}
          <div className="flex flex-col items-center justify-center gap-6 mb-16">
            <h2 className="text-5xl font-bold text-center">
              <span className="warm-gradient">Featured Projects</span>
            </h2>
            
            <Link 
              href="/projects" 
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-base-200/50 hover:bg-base-300/50 transition-all duration-300"
            >
              View All Projects
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} // Use unique ID from data
                project={project} 
                index={index}
                setHovered={setHoveredProject}
                isHovered={hoveredProject === project.id} // Update hover tracking to use ID
              />
            ))}
          </div>

          {projectsData.projects.length > 3 && (
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <button 
                onClick={() => setShowAll(!showAll)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-content hover:opacity-90 transition-opacity"
              >
                {showAll ? 'Show Less' : 'Load More Projects'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// Also update the tech stack mapping to ensure unique keys
function ProjectCard({ project, index, setHovered, isHovered }) {
  const [imageError, setImageError] = useState(false)
  const [showAllTech, setShowAllTech] = useState(false)
  const [showFeatures, setShowFeatures] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (showFeatures) setShowFeatures(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFeatures]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setHovered(project.id)} // Update to use ID
      onHoverEnd={() => setHovered(null)}
      className="group relative bg-base-200 rounded-2xl overflow-hidden"
    >
      {/* Updated Project Image with Fallback */}
      <div className="relative h-48 overflow-hidden bg-base-300">
        {project.image && !imageError ? (
          <motion.img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <DynamicLogo title={project.title} />
        )}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-base-300/90 via-base-300/20 to-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <motion.h3 
          className="text-xl font-bold"
          animate={{
            color: isHovered ? 'hsl(var(--p))' : 'currentColor'
          }}
        >
          {project.title}
        </motion.h3>
        
        <p className="text-base-content/70 text-sm line-clamp-2">
          {project.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <FaTags className="text-primary" />
              <span>Technologies</span>
            </div>
            <motion.button
              onClick={() => setShowAllTech(!showAllTech)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-primary hover:text-primary/80"
            >
              <motion.div
                animate={{ rotate: showAllTech ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown />
              </motion.div>
            </motion.button>
          </div>

          <motion.div 
            className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto"
            animate={{ height: showAllTech ? 'auto' : '2rem' }}
          >
            {(showAllTech ? project.tech : project.tech.slice(0, 3)).map((tech, techIndex) => (
              <motion.span 
                key={`${project.id}-${tech}-${techIndex}`}
                initial={showAllTech ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs whitespace-nowrap"
              >
                {tech}
              </motion.span>
            ))}
            {!showAllTech && project.tech.length > 3 && (
              <motion.span
                className="px-2 py-1 bg-base-300 rounded-full text-xs cursor-pointer hover:bg-base-300/80 whitespace-nowrap"
                onClick={() => setShowAllTech(true)}
              >
                +{project.tech.length - 3} more
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Action Buttons - Always visible on mobile */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowFeatures(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors text-sm"
          >
            <FaListUl /> Features
          </button>
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-base-300/50 hover:bg-base-300 transition-colors text-sm"
          >
            <FaGithub /> Code
          </a>
          <a 
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm"
          >
            <FaExternalLinkAlt /> Preview
          </a>
        </div>

      </div>

      {/* Features Dialog */}
      <FeaturesDialog 
        isOpen={showFeatures} 
        onClose={() => setShowFeatures(false)} 
        project={project}
      />

      {/* Hover Effect Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? 'inset 0 0 0 2px hsl(var(--p))' 
            : 'inset 0 0 0 0 transparent'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  )
}
