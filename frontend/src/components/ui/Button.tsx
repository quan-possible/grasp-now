import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'muted' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  selected?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  selected = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-fast ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent-hover rounded-lg',
    secondary: 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary rounded-lg',
    muted: selected ? 'bg-pastel-red text-accent rounded-lg' : 'bg-pastel-teal text-text-primary hover:bg-pastel-red hover:text-accent rounded-lg',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary rounded-lg',
    text: 'bg-transparent text-text-secondary hover:text-text-primary hover:underline'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const widthClass = fullWidth ? 'w-full' : 'w-auto';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-text-tertiary border-t-current mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};