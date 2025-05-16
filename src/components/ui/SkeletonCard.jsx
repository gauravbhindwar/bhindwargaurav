import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-base-200 rounded-2xl overflow-hidden animate-pulse">
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
    </div>
  );
};

export const ProjectsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkillsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-[400px] bg-base-200 rounded-3xl p-8 animate-pulse">
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
        </div>
      ))}
    </div>
  );
};

export const CertificationsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-72 bg-base-200 rounded-3xl p-8 animate-pulse">
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
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
