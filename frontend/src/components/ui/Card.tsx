import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const baseClasses = 'bg-bg-primary rounded-xl shadow-md transition-all duration-fast ease-in-out';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer active:scale-[0.98]' : '';
  
  const classes = `
    ${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}
  `.trim();
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};