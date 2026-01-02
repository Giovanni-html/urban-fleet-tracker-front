import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPaneProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassPane = ({ className, children, ...props }: GlassPaneProps) => {
  return (
    <motion.div
      className={cn("glass-panel rounded-2xl overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};
