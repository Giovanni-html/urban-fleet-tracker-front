import { motion } from 'framer-motion';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
            <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
          </linearGradient>
          
          <linearGradient id="accentGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" /> {/* White/Bright */}
            <stop offset="100%" stopColor="#22d3ee" /> {/* Cyan */}
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Outer Tech Ring (Hexay-circle) */}
        <motion.path
          d="M50 15 C 69.3 15 85 30.7 85 50 C 85 69.3 69.3 85 50 85 C 30.7 85 15 69.3 15 50"
          stroke="url(#mainGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#softGlow)"
          initial={{ pathLength: 0, opacity: 0, rotate: -90 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Inner Fleet Arrow */}
        <motion.path
          d="M35 65 L 50 25 L 65 65 L 50 55 L 35 65 Z"
          fill="url(#accentGrad)"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#softGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
        />

        {/* Decorative Dot/System Node */}
        <motion.circle
          cx="15" 
          cy="50" 
          r="4" 
          fill="#3b82f6"
          filter="url(#softGlow)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, delay: 1 }}
        />
      </svg>
    </div>
  );
};

