import React from 'react';
import { ResponsiveContainer } from './ResponsiveContainer';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  as?: React.ElementType;
}

/**
 * A section component that provides consistent spacing and styling
 * for page sections.
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  containerClassName = '',
  id,
  as: Component = 'section',
}) => {
  return (
    <Component
      id={id}
      className={`py-16 sm:py-24 ${className}`}
    >
      <ResponsiveContainer className={containerClassName}>
        {children}
      </ResponsiveContainer>
    </Component>
  );
};