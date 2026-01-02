import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  header: ReactNode;
}

export const DashboardLayout = ({ sidebar, header, children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-slate-950 p-4 gap-4 overflow-hidden relative">
      {/* Background Elements (Optional for depth) */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1.5 }}
         className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1.5, delay: 0.5 }}
         className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Sidebar Area */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-20 h-full z-10 hidden md:block"
      >
        {sidebar}
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full gap-4 z-10 min-w-0">
        {/* Header */}
        <header className="h-16 w-full shrink-0">
          {header}
        </header>

        {/* Content Body */}
        <div className="flex-1 relative min-h-0">
         {children}
        </div>
      </main>
    </div>
  );
};
