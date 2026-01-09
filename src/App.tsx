import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FleetProvider, useFleet } from './context/FleetContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { GlassPane } from './components/GlassPane';
import { Sidebar } from './components/Sidebar';
import { Search, Bell, Scan } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { 
  DashboardPage, 
  AnalyticsPage, 
  ActivityPage, 
  WeatherPage, 
  SettingsPage 
} from './pages';

// Inner component that uses the context
function AppContent() {
  const { searchQuery, setSearchQuery } = useFleet();
  const [isLoading, setIsLoading] = useState(true);

  // Fixed 2.5 second loading screen
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Loading Screen - z-50 covers everything until map signals ready */}
      <LoadingScreen isLoading={isLoading} />
      
      {/* Dashboard always renders behind loading screen */}
      <div className="opacity-100">
        <DashboardLayout
          sidebar={<Sidebar />}
          header={
            <div className="flex justify-between items-center h-full px-6 lg:px-0">
               <h1 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
                 <div className="h-2 w-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
                 Fleet Tracking
               </h1>
               <div className="flex gap-4 items-center">
                  <GlassPane className="h-10 w-64 flex items-center px-4 gap-3 text-slate-400 text-sm hover:border-white/20 transition-colors">
                     <Search size={16} />
                     <input 
                       placeholder="Search..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full"
                     />
                  </GlassPane>
                  
                  <div className="flex gap-2">
                     <GlassPane className="h-10 w-10 flex items-center justify-center p-0 rounded-lg cursor-pointer hover:bg-white/5 active:scale-95 transition-all">
                        <Scan size={18} className="text-cyan-400" />
                     </GlassPane>
                     <GlassPane className="h-10 w-10 flex items-center justify-center p-0 rounded-lg cursor-pointer hover:bg-white/5 active:scale-95 transition-all relative">
                        <Bell size={18} className="text-slate-300" />
                        <div className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border border-slate-900" />
                     </GlassPane>
                     <GlassPane className="h-10 w-10 flex items-center justify-center p-0 rounded-lg cursor-pointer hover:bg-white/5 active:scale-95 transition-all">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20" />
                     </GlassPane>
                  </div>
               </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </DashboardLayout>
      </div>
    </>
  );
}

// Main App wrapped with Provider and Router
function App() {
  return (
    <BrowserRouter>
      <FleetProvider>
        <AppContent />
      </FleetProvider>
    </BrowserRouter>
  );
}

export default App;
