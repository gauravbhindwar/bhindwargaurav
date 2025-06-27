// Image optimization utilities for better performance

/**
 * Optimizes image URL for better loading performance
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export function optimizeImageUrl(imageUrl, options = {}) {
  if (!imageUrl) return imageUrl;
  
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'auto'
  } = options;
  
  // For external URLs, we can't optimize directly but we can add loading hints
  // This is a placeholder for future CDN integration (Cloudinary, etc.)
  
  // If it's a supported CDN, we could add optimization parameters
  if (imageUrl.includes('cloudinary.com')) {
    // Add Cloudinary transformations
    const transformations = [];
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality !== 80) transformations.push(`q_${quality}`);
    transformations.push('f_auto'); // Auto format
    
    if (transformations.length > 0) {
      return imageUrl.replace('/upload/', `/upload/${transformations.join(',')}/`);
    }
  }
  
  // For other URLs, return as-is
  return imageUrl;
}

/**
 * Preloads an image and returns a promise
 * @param {string} src - Image source URL
 * @param {Object} options - Options for preloading
 * @returns {Promise} - Promise that resolves when image is loaded
 */
export function preloadImage(src, options = {}) {
  return new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
      return;
    }
    
    const { timeout = 10000 } = options;
    
    const img = new Image();
    const timeoutId = setTimeout(() => {
      reject(new Error('Image loading timeout'));
    }, timeout);
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve({
        src,
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Failed to load image'));
    };
    
    // Set the optimized URL
    img.src = optimizeImageUrl(src, options);
  });
}

/**
 * Validates if a URL is a valid image URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid image URL
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  // Check for image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(url);
}

/**
 * Gets image dimensions without loading the full image
 * @param {string} src - Image source URL
 * @returns {Promise} - Promise that resolves with dimensions
 */
export function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension calculation'));
    };
    
    img.src = src;
  });
}

/**
 * Creates a blob URL for an image file for preview purposes
 * @param {File} file - Image file
 * @returns {string} - Blob URL
 */
export function createImagePreview(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Invalid image file');
  }
  
  return URL.createObjectURL(file);
}

/**
 * Revokes a blob URL to free up memory
 * @param {string} blobUrl - Blob URL to revoke
 */
export function revokeImagePreview(blobUrl) {
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl);
  }
}
