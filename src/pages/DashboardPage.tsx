import { GlassPane } from '../components/GlassPane';
import { StatCard } from '../components/StatCard';
import { UnitList } from '../components/UnitList';
import { FleetMap3D } from '../components/FleetMap3D';
import { useFleet } from '../context/FleetContext';

export const DashboardPage = () => {
  const { units } = useFleet();
  
  return (
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
  );
};
