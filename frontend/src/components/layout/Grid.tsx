import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = ''
}) => {
  const gridCols: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2', 
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };
  
  const smCols = cols.sm ? `sm:${gridCols[cols.sm]}` : '';
  const mdCols = cols.md ? `md:${gridCols[cols.md]}` : '';
  const lgCols = cols.lg ? `lg:${gridCols[cols.lg]}` : '';
  const xlCols = cols.xl ? `xl:${gridCols[cols.xl]}` : '';
  
  const gapClass = `gap-${gap}`;
  
  const classes = `grid ${smCols} ${mdCols} ${lgCols} ${xlCols} ${gapClass} ${className}`.trim();
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };
  
  const classes = `${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: number;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = false,
  gap = 0,
  className = ''
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };
  
  const wrapClass = wrap ? 'flex-wrap' : '';
  const gapClass = gap > 0 ? `gap-${gap}` : '';
  
  const classes = `flex ${directionClass} ${justifyClasses[justify]} ${alignClasses[align]} ${wrapClass} ${gapClass} ${className}`.trim();
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};