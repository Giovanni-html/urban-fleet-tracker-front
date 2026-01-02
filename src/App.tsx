import { useState, useEffect } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { GlassPane } from './components/GlassPane';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { UnitList } from './components/UnitList';
import { FleetMap3D } from './components/FleetMap3D';
import { Search, Bell, Scan } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';

// Inner component that uses the context
function AppContent() {
  const { units, searchQuery, setSearchQuery, activeView } = useFleet();
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
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full pb-[70px]">
              {/* Left Panel: Active Units */}
              <div className="col-span-1 lg:col-span-3 h-full min-h-0">
                <UnitList />
              </div>

              {/* Right Panel: Map & Stats */}
              <div className="col-span-1 lg:col-span-7 h-full min-h-0 relative">
                 {/* Stats Overlay */}
                 <div className="absolute top-px right-4 z-50 w-full max-w-[500px] grid grid-cols-2 md:grid-cols-3 gap-3 pointer-events-none">
                    <div className="pointer-events-auto contents">
                        <StatCard 
                            title="Active Units" 
                            value={units.length.toString()} 
                            change={units.length.toString()} 
                            trend="up" 
                            variant="bar" 
                            chartData={[12, 14, 13, 15, 16, 14, 15]}
                        />
                        <StatCard 
                            title="Avg Response" 
                            value="3m 45s" 
                            change="12%" 
                            trend="down" 
                            variant="bar" 
                            chartData={[45, 42, 48, 40, 38, 35, 42]}
                        />
                        <StatCard 
                            title="Incidents" 
                            value="12" 
                            change="12" 
                            trend="up" 
                            variant="bar" 
                            chartData={[5, 8, 3, 12, 6, 9, 12]}
                        />
                    </div>
                 </div>
                 
                 {/* Map Area */}
                 <GlassPane className="h-[calc(100%-25px)] mt-[25px] w-full relative border-slate-800/60 bg-slate-900/80 overflow-hidden p-0">
                    <FleetMap3D />
                 </GlassPane>
              </div>
            </div>
          )}

          {/* Activity View - Placeholder */}
          {activeView === 'activity' && (
            <GlassPane className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Activity Log</h2>
                <p className="text-slate-400">Recent fleet activity and events</p>
                <p className="text-slate-500 text-sm mt-4">Coming soon...</p>
              </div>
            </GlassPane>
          )}

          {/* Weather View - Placeholder */}
          {activeView === 'weather' && (
            <GlassPane className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Weather Conditions</h2>
                <p className="text-slate-400">Weather data for fleet operations</p>
                <p className="text-slate-500 text-sm mt-4">Coming soon...</p>
              </div>
            </GlassPane>
          )}

          {/* Settings View - Placeholder */}
          {activeView === 'settings' && (
            <GlassPane className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                <p className="text-slate-400">Configure your fleet tracker</p>
                <p className="text-slate-500 text-sm mt-4">Coming soon...</p>
              </div>
            </GlassPane>
          )}
        </DashboardLayout>
      </div>
    </>
  );
}

// Main App wrapped with Provider
function App() {
  return (
    <FleetProvider>
      <AppContent />
    </FleetProvider>
  );
}

export default App;
