'use client'

import { motion } from 'framer-motion'
import * as SimpleIcons from 'simple-icons'
import { useTheme } from '@/components/theme-provider'
import useFetch from '@/hooks/useFetch'
import { SkillsSkeleton } from '@/components/ui/SkeletonCard'

export default function Skills() {
  const { data: skillsData, loading, error } = useFetch('/api/skills', {
    revalidate: 600000 // 10 minutes cache
  })

  if (loading) {
    return (
      <section id="skills" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100/50 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-center mb-16">
              <span className="warm-gradient">Technical Arsenal</span>
            </h2>

            <SkillsSkeleton />
          </motion.div>
        </div>
      </section>
    )
  }

  if (error || !skillsData) {
    return (
      <section id="skills" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-error">Failed to load skills data</p>
          </div>
        </div>
      </section>
    )
  }

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

          <TechnicalSkills skillsData={skillsData} />
        </motion.div>
      </div>
    </section>
  )
}

function TechnicalSkills({ skillsData }) {
  // Function to separate Web Development skills into Frontend and Backend
  const getWebDevSkills = (category) => {
    if (category.name !== "Web Development") return null;
    
    // Define which skills belong to frontend/backend - expanded list
    const frontendSkills = [
      "React.js", "Next.js", "React Server Components", 
      "Redux", "React Query", "Tailwind CSS", 
      "Material UI", "Shadcn UI", "Framer Motion",
      "CSS Modules", "Styled Components"
    ];
    
    const backendSkills = [
      "Node.js", "Express.js", "REST API", 
      "GraphQL", "JWT Auth", "MongoDB", 
      "Mongoose", "PostgreSQL", "Prisma", 
      "Nodemailer", "Socket.io", "NextAuth.js"
    ];
    
    // Group the skills
    const frontend = category.skills.filter(skill => 
      frontendSkills.includes(skill.name)
    );
    
    const backend = category.skills.filter(skill => 
      backendSkills.includes(skill.name)
    );
    
    // Include any skills that might not be in either list (future-proofing)
    const unclassifiedSkills = category.skills.filter(skill => 
      !frontendSkills.includes(skill.name) && !backendSkills.includes(skill.name)
    );
    
    // If there are any unclassified skills, add them to frontend or backend based on best guess
    if (unclassifiedSkills.length > 0) {
      console.log("Found unclassified skills:", unclassifiedSkills.map(s => s.name));
      
      // Add to backend by default for now
      backend.push(...unclassifiedSkills);
    }
    
    return { frontend, backend };
  };

  // Group categories by length to create a better layout
  const categorizeByLength = () => {
    // Create a copy of the categories array to avoid mutation
    const categories = [...skillsData.categories];
    
    // Sort categories by number of skills in descending order
    return categories.sort((a, b) => {
      // For Web Development, count both frontend and backend skills
      if (a.name === "Web Development") {
        const webDevSkills = getWebDevSkills(a);
        a.skillCount = webDevSkills.frontend.length + webDevSkills.backend.length;
      } else {
        a.skillCount = a.skills.length;
      }
      
      if (b.name === "Web Development") {
        const webDevSkills = getWebDevSkills(b);
        b.skillCount = webDevSkills.frontend.length + webDevSkills.backend.length;
      } else {
        b.skillCount = b.skills.length;
      }
      
      return b.skillCount - a.skillCount;
    });
  };
  
  const sortedCategories = categorizeByLength();  
  return (
    <div className="space-y-12">
      {/* Skills Grid with Optimized Layout */}
      <div className="grid grid-cols-1 gap-8">
        {/* Web Development - Always full width for prominence */}
        {sortedCategories.map((category, idx) => {
          if (category.name === "Web Development") {
            const webDevSkills = getWebDevSkills(category);
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                            border border-base-content/5 hover:border-primary/20 transition-all duration-300
                            hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden">
                  <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center">
                    <span className="mr-2">{category.name}</span>
                    <span className="badge badge-sm badge-primary">{webDevSkills.frontend.length + webDevSkills.backend.length}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Frontend skills section */}
                    <div className="bg-base-100/30 rounded-2xl p-4 border border-base-content/5">
                      <h4 className="font-medium text-base-content/70 mb-3 text-sm uppercase tracking-wider flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Frontend <span className="ml-2 badge badge-xs badge-ghost">{webDevSkills.frontend.length}</span>
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {webDevSkills.frontend.map((skill, index) => (
                          <SkillBadge key={skill.name} skill={skill} index={index} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Backend skills section */}
                    <div className="bg-base-100/30 rounded-2xl p-4 border border-base-content/5">
                      <h4 className="font-medium text-base-content/70 mb-3 text-sm uppercase tracking-wider flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                        </svg>
                        Backend <span className="ml-2 badge badge-xs badge-ghost">{webDevSkills.backend.length}</span>
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {webDevSkills.backend.map((skill, index) => (
                          <SkillBadge key={skill.name} skill={skill} index={index + webDevSkills.frontend.length} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }
          return null;
        })}
        
        {/* Other categories in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedCategories.map((category, idx) => {
            if (category.name === "Web Development") return null;
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group h-full"
              >
                <div className="h-full bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-6 
                            border border-base-content/5 hover:border-primary/20 transition-all duration-300
                            hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                  <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-flex items-center">
                    <span className="mr-2">{category.name}</span>
                    <span className="badge badge-sm badge-primary">{category.skills.length}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, index) => (
                      <SkillBadge key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Courses Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-br from-base-200/80 to-base-300/80 backdrop-blur-lg rounded-3xl p-8 
                      border border-base-content/5 hover:border-primary/20 transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Academic Journey
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['Current', 'Completed'].map((type, idx) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-base-100/30 rounded-2xl p-6 border border-base-content/5"
              >
                <h4 className="font-bold mb-4 flex items-center">
                  {type === 'Current' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {type} Coursework
                  <span className="ml-2 badge badge-sm badge-primary">{skillsData.courses[type.toLowerCase()].length}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skillsData.courses[type.toLowerCase()].map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="px-3 py-1.5 rounded-lg bg-base-200/70 border border-base-content/5 
                                hover:border-primary/20 hover:bg-base-300/50 transition-all duration-300 
                                hover:scale-105">
                        <span className="text-sm">{course}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-base-100/70 border border-base-content/5 
                    hover:border-primary/20 hover:bg-base-200/60 transition-all duration-300 
                    hover:scale-105 hover:shadow-md backdrop-blur-sm">
        {Icon && (
          <svg
            className="w-3.5 h-3.5 text-primary group-hover:text-secondary transition-colors duration-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={Icon.path} />
          </svg>
        )}
        <span className="text-xs font-medium tracking-wide">{skill.name}</span>
      </div>
    </motion.div>
  )
}
