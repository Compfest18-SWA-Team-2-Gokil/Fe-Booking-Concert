import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of animation for the skeleton.
   * 'pulse' - A simple fading in and out animation (Tailwind default).
   * 'shimmer' - A sweeping gradient animation.
   * 'none' - No animation.
   */
  variant?: 'pulse' | 'shimmer' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'pulse', 
  className = '', 
  ...props 
}) => {
  const a11yProps = {
    'aria-hidden': true,
    'aria-busy': true,
    role: 'status' as const
  };

  if (variant === 'shimmer') {
    return (
      <div 
        className={`relative overflow-hidden bg-slate-200 rounded-md ${className}`}
        {...a11yProps}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] motion-reduce:animate-none bg-linear-to-r from-transparent via-white/60 to-transparent" />
      </div>
    );
  }

  if (variant === 'none') {
    return (
      <div 
        className={`bg-slate-200 rounded-md ${className}`} 
        {...a11yProps}
        {...props} 
      />
    );
  }

  // Default to pulse
  return (
    <div 
      className={`animate-pulse motion-reduce:animate-none bg-slate-200 rounded-md ${className}`} 
      {...a11yProps}
      {...props} 
    />
  );
};

export default Skeleton;
