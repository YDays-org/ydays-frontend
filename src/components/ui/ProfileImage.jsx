import { useState } from 'react';

const ProfileImage = ({ 
  src, 
  alt = "Profile picture", 
  size = "w-20 h-20", 
  fallbackName = "?",
  className = "" 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    console.warn('Failed to load profile image:', src);
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!src || imageError) {
    return (
      <div 
        className={`${size} rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold border-2 border-gray-200 ${className}`}
      >
        {fallbackName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`relative ${size} ${className}`}>
      {isLoading && (
        <div className={`absolute inset-0 ${size} rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200`}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img 
        src={src}
        alt={alt}
        className={`${size} rounded-full object-cover border-2 border-gray-200 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ProfileImage;
