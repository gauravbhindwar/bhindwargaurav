import { motion } from 'framer-motion';

const SkeletonCard = ({ index = 0 }) => {
  return (
    <motion.div 
      className="bg-base-200 rounded-2xl overflow-hidden animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      {/* Image skeleton */}
      <div className="h-48 bg-base-300"></div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-7 bg-base-300 rounded-lg w-3/4"></div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-4 bg-base-300 rounded w-5/6"></div>
        </div>
        
        {/* Tech stack */}
        <div className="pt-2">
          <div className="flex gap-2 mb-2">
            <div className="h-4 bg-base-300 rounded w-1/4"></div>
            <div className="h-4 bg-base-300 rounded w-1/6"></div>
            <div className="h-4 bg-base-300 rounded w-1/5"></div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <div className="h-9 bg-base-300 rounded-lg w-1/4"></div>
          <div className="h-9 bg-base-300 rounded-lg w-1/4"></div>
          <div className="h-9 bg-base-300 rounded-lg w-1/4"></div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSkeleton = () => {
  return (
    <motion.div 
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </motion.div>
  );
};

export const SkillsSkeleton = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {[...Array(4)].map((_, i) => (
        <motion.div 
          key={i} 
          className="h-[400px] bg-base-200 rounded-3xl p-8 animate-pulse"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
        >
          <div className="h-8 bg-base-300 rounded-lg w-1/2 mb-8"></div>
          
          {/* Add Frontend/Backend sections for the second card (Web Development) */}
          {i === 1 ? (
            <>
              <div className="h-4 bg-base-300/50 rounded w-24 mb-3"></div>
              <div className="flex flex-wrap gap-3 mb-6">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-8 bg-base-300 rounded-full w-24"></div>
                ))}
              </div>
              
              <div className="h-4 bg-base-300/50 rounded w-24 mb-3"></div>
              <div className="flex flex-wrap gap-3">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-8 bg-base-300 rounded-full w-24"></div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-wrap gap-3">
              {[...Array(i === 2 ? 8 : 7)].map((_, j) => (
                <div key={j} className="h-8 bg-base-300 rounded-full w-24"></div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const CertificationsSkeleton = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div 
          key={i} 
          className="h-72 bg-base-200 rounded-3xl p-8 animate-pulse"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
        >
          <div className="flex justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-base-300"></div>
            <div className="w-24 h-10 rounded-full bg-base-300"></div>
          </div>
          <div className="h-6 bg-base-300 rounded-lg w-3/4 mb-4"></div>
          <div className="h-4 bg-base-300 rounded-lg w-2/3 mb-4"></div>
          <div className="h-4 bg-base-300 rounded-lg w-full mb-6"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-6 w-16 bg-base-300 rounded-full"></div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkeletonCard;
