import React, { useState, useEffect } from 'react';

const BASE_BACKEND_URL = "http://localhost:8000";

/**
 * Enhanced image component that handles admin-uploaded assets and fallbacks
 * Ensures all project images from admin are properly displayed
 */
const ProjectImage = ({
  project,
  className = "",
  alt = project?.title || 'Project image',
  priority = 'IMAGE',
  fallbackEnabled = true
}) => {
  const getImageSrc = () => {
    // Try to get image from project_images first (new system)
    if (project?.project_images && project.project_images.length > 0) {
      // Look for specific asset type first
      const priorityAsset = project.project_images.find(img => img.is_featured);
      if (priorityAsset?.image) {
        return priorityAsset.image.startsWith('http')
          ? priorityAsset.image
          : `${BASE_BACKEND_URL}${priorityAsset.image}`;
      }

      // Fallback to first available image
      const firstImage = project.project_images[0];
      if (firstImage?.image) {
        return firstImage.image.startsWith('http')
          ? firstImage.image
          : `${BASE_BACKEND_URL}${firstImage.image}`;
      }
    }

    // Try to get image from admin assets (legacy system)
    if (project?.assets && project.assets.length > 0) {
      // Look for specific asset type first
      const priorityAsset = project.assets.find(asset => asset.asset_type === priority);
      if (priorityAsset?.file) {
        return priorityAsset.file.startsWith('http')
          ? priorityAsset.file
          : `${BASE_BACKEND_URL}${priorityAsset.file}`;
      }

      // Fallback to first available asset
      const firstAsset = project.assets[0];
      if (firstAsset?.file) {
        return firstAsset.file.startsWith('http')
          ? firstAsset.file
          : `${BASE_BACKEND_URL}${firstAsset.file}`;
      }
    }

    // Fallback to project_image field
    if (project?.project_image) {
      return project.project_image.startsWith('http')
        ? project.project_image
        : `${BASE_BACKEND_URL}${project.project_image}`;
    }

    // Final fallback to placeholder
    return `https://picsum.photos/seed/${project?.id || 'default'}/800/600`;
  };

  const handleImageError = (e) => {
    if (fallbackEnabled) {
      console.warn(`Image failed to load for project ${project?.id}:`, e.target.src);
      // Fallback to placeholder
      e.target.src = `https://picsum.photos/seed/${project?.id || 'default'}/800/600`;
    }
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleImageError}
      loading="lazy"
    />
  );
};

/**
 * Project Image Carousel with auto-scroll functionality
 */
const ProjectImageCarousel = ({
  project,
  className = "",
  autoScroll = true,
  scrollInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getImages = () => {
    const images = [];

    // Get images from project_images (new system)
    if (project?.project_images && project.project_images.length > 0) {
      project.project_images.forEach(img => {
        if (img.image) {
          images.push({
            src: img.image.startsWith('http') ? img.image : `${BASE_BACKEND_URL}${img.image}`,
            alt: img.alt_text || `${project.title} - Image`,
            isFeatured: img.is_featured
          });
        }
      });
    }

    // Fallback to assets (legacy system)
    if (images.length === 0 && project?.assets && project.assets.length > 0) {
      project.assets.forEach(asset => {
        if (asset.asset_type === 'IMAGE' && asset.file) {
          images.push({
            src: asset.file.startsWith('http') ? asset.file : `${BASE_BACKEND_URL}${asset.file}`,
            alt: asset.asset_name || `${project.title} - Image`,
            isFeatured: false
          });
        }
      });
    }

    // Fallback to single project_image
    if (images.length === 0 && project?.project_image) {
      images.push({
        src: project.project_image.startsWith('http') ? project.project_image : `${BASE_BACKEND_URL}${project.project_image}`,
        alt: `${project.title} - Image`,
        isFeatured: true
      });
    }

    // Final fallback to placeholder
    if (images.length === 0) {
      images.push({
        src: `https://picsum.photos/seed/${project?.id || 'default'}/800/600`,
        alt: `${project.title} - Placeholder`,
        isFeatured: true
      });
    }

    return images;
  };

  const images = getImages();

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, images.length, isHovered, scrollInterval]);

  const handleImageClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={images[0].src}
          alt={images[0].alt}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative h-full">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onClick={handleImageClick}
        />

        {/* Navigation Arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleDotClick(index);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex
              ? 'bg-white w-4'
              : 'bg-white/50 hover:bg-white/75'
              }`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-[10px] rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

/**
 * Enhanced developer profile image component
 */
const DeveloperImage = ({
  developer,
  className = "",
  alt = developer?.name || 'Developer',
  size = "w-12 h-12"
}) => {
  const getImageSrc = () => {
    if (developer?.profile_image) {
      return developer.profile_image.startsWith('http')
        ? developer.profile_image
        : `${BASE_BACKEND_URL}${developer.profile_image}`;
    }

    // Fallback to avatar generator
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer?.name || 'dev'}`;
  };

  const handleImageError = (e) => {
    console.warn(`Developer image failed to load for ${developer?.name}:`, e.target.src);
    // Fallback to default avatar
    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${developer?.name || 'dev'}`;
  };

  if (!developer?.profile_image) {
    // Return placeholder div if no image
    return (
      <div className={`${size} rounded-full bg-zinc-700 flex items-center justify-center`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={`${size} rounded-full object-cover`}
      referrerPolicy="no-referrer"
      onError={handleImageError}
      loading="lazy"
    />
  );
};

/**
 * Resource image component for blog posts and guides
 */
const ResourceImage = ({
  resource,
  className = "",
  alt = resource?.title || 'Resource image'
}) => {
  const getImageSrc = () => {
    if (resource?.image) {
      return resource.image.startsWith('http')
        ? resource.image
        : `${BASE_BACKEND_URL}${resource.image}`;
    }

    // Fallback to placeholder based on category
    const categorySeeds = {
      'BLOG': 'blog',
      'GUIDE': 'guide',
      'TOOL': 'tool',
      'GLOSSARY': 'glossary'
    };
    return `https://picsum.photos/seed/${categorySeeds[resource?.category] || 'resource'}/800/600`;
  };

  const handleImageError = (e) => {
    console.warn(`Resource image failed to load for ${resource?.title}:`, e.target.src);
    e.target.src = `https://picsum.photos/seed/${resource?.category || 'resource'}/800/600`;
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export { ProjectImage, ProjectImageCarousel, DeveloperImage, ResourceImage };
