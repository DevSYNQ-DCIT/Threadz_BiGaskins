import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  className = '',
}) => {
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClass} animate-spin rounded-full border-b-2 border-gray-900`}
        style={{
          borderColor: 'transparent',
          borderTopColor: 'currentColor',
          borderRightColor: 'currentColor',
          borderBottomColor: 'currentColor',
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
