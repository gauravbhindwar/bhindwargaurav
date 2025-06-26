'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaListUl } from 'react-icons/fa'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import useFetch from '@/hooks/useFetch'

// Add DynamicLogo component
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

// Add FeaturesDialog component at the top of the file (same implementation as in Projects.js)
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

export default function ViewAllProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const { data: projectsData, loading, error } = useFetch('/api/projects');

  if (loading) {
    return (
      <main className="min-h-screen py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !projectsData) {
    return (
      <main className="min-h-screen py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load projects data</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link 
              href="/"
              className="btn btn-ghost gap-2 mb-8"
            >
              <FaArrowLeft /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                All Projects
              </span>
            </h1>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {projectsData.projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                setSelected={setSelectedProject}
                isHovered={hoveredProject === project.id}
                setHovered={setHoveredProject}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Add Features Dialog */}
      <FeaturesDialog 
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject || {}}
      />
    </main>
  )
}

// Add ProjectCard component
const ProjectCard = ({ project, index, setSelected, isHovered, setHovered }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onHoverStart={() => setHovered(project.id)}
      onHoverEnd={() => setHovered(null)}
      className="bg-base-200 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden">
        {project.image && !imageError ? (
          <motion.img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover object-center"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <DynamicLogo title={project.title} />
        )}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-base-300/90 via-transparent"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Rest of the card content */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        <p className="text-base-content/70 mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tech.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <button 
            onClick={() => setSelected(project)}
            className="btn btn-outline gap-2"
          >
            <FaListUl /> Features
          </button>
          <a 
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline gap-2"
          >
            <FaGithub /> View Code
          </a>
          <a 
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary gap-2"
          >
            <FaExternalLinkAlt /> Live Demo
          </a>
        </div>
      </div>
    </motion.article>
  );
};
