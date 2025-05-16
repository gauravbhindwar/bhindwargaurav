// Utility to prefetch API data for better performance

export const prefetchData = () => {
  // Prefetch common routes
  const prefetchRoutes = ['/api/projects', '/api/skills', '/api/certifications', '/api/contact'];
  
  // Use requestIdleCallback for better performance
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchRoutes.forEach(route => {
        fetch(route)
          .then(res => res.json())
          .then(() => {
            console.log(`Prefetched: ${route}`);
          })
          .catch(err => {
            console.error(`Failed to prefetch ${route}:`, err);
          });
      });
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      prefetchRoutes.forEach(route => {
        fetch(route).catch(e => console.error(e));
      });
    }, 2000);
  }
};
