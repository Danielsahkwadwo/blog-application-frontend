import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * A responsive container component that provides consistent padding and max-width
 * across different screen sizes.
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Component>
  );
};