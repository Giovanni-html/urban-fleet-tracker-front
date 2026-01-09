import { GlassPane, cn } from '../components/GlassPane';
import { useFleet } from '../context/FleetContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Truck, 
  Activity,
  Zap
} from 'lucide-react';

// Mock analytics data
const weeklyData = [
  { day: 'Seg', incidents: 12, responses: 15, efficiency: 87 },
  { day: 'Ter', incidents: 8, responses: 12, efficiency: 92 },
  { day: 'Qua', incidents: 15, responses: 18, efficiency: 85 },
  { day: 'Qui', incidents: 6, responses: 8, efficiency: 95 },
  { day: 'Sex', incidents: 10, responses: 14, efficiency: 88 },
  { day: 'Sáb', incidents: 4, responses: 5, efficiency: 96 },
  { day: 'Dom', incidents: 3, responses: 4, efficiency: 98 },
];

const topNeighborhoods = [
  { name: 'Centro Cívico', incidents: 28, trend: 'up' },
  { name: 'Batel', incidents: 22, trend: 'down' },
  { name: 'Água Verde', incidents: 18, trend: 'up' },
  { name: 'Rebouças', incidents: 15, trend: 'down' },
  { name: 'Jardim Botânico', incidents: 12, trend: 'stable' },
];

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  trend 
}: { 
  icon: typeof TrendingUp; 
  label: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down';
}) => (
  <GlassPane className="p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className={cn(
        "p-2.5 rounded-xl",
        trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}>
        <Icon size={20} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        trend === 'up' ? "text-emerald-400" : "text-rose-400"
      )}>
        {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  </GlassPane>
);

const BarChart = ({ data }: { data: typeof weeklyData }) => {
  const maxIncidents = Math.max(...data.map(d => d.incidents));
  
  return (
    <div className="flex items-end justify-between gap-2 h-64 px-2 pt-4">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center h-full">
          <div className="flex-1 w-full flex items-end">
            <div 
              className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-cyan-400 hover:to-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              style={{ height: `${(item.incidents / maxIncidents) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-2">{item.day}</span>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsPage = () => {
  const { units, hazardZones } = useFleet();
  
  const activeUnits = units.filter(u => u.status === 'ACTIVE').length;
  const emergencyUnits = units.filter(u => u.status === 'EMERGENCY').length;
  const avgEfficiency = Math.round(weeklyData.reduce((acc, d) => acc + d.efficiency, 0) / weeklyData.length);
  
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 overflow-y-auto">
      {/* Left Column - Key Metrics */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-cyan-400" size={20} />
          Key Metrics
        </h2>
        
        <MetricCard 
          icon={Truck} 
          label="Active Units" 
          value={activeUnits.toString()} 
          change="+12%" 
          trend="up" 
        />
        
        <MetricCard 
          icon={Clock} 
          label="Avg Response Time" 
          value="3m 42s" 
          change="-8%" 
          trend="up" 
        />
        
        <MetricCard 
          icon={AlertTriangle} 
          label="Active Hazard Zones" 
          value={hazardZones.length.toString()} 
          change={hazardZones.length > 3 ? "+2" : "-1"} 
          trend={hazardZones.length > 3 ? "down" : "up"}
        />
        
        <MetricCard 
          icon={Activity} 
          label="Fleet Efficiency" 
          value={`${avgEfficiency}%`} 
          change="+5%" 
          trend="up" 
        />
      </div>
      
      {/* Middle Column - Charts */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Weekly Incidents</h2>
        
        <GlassPane className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-bold text-white">58</p>
              <p className="text-xs text-slate-400">Total this week</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
              <TrendingDown size={14} />
              -12% vs last week
            </div>
          </div>
          
          <div className="flex-1" />
          
          <BarChart data={weeklyData} />
        </GlassPane>
        
        <GlassPane className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Response Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Patrol', value: 65, color: 'bg-cyan-500' },
              { label: 'Medical', value: 25, color: 'bg-emerald-500' },
              { label: 'Emergency', value: 10, color: 'bg-rose-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-16">{item.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-700", item.color)}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs text-white font-medium w-8">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassPane>
      </div>
      
      {/* Right Column - Top Neighborhoods */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="text-cyan-400" size={20} />
          Top Neighborhoods
        </h2>
        
        <GlassPane className="p-5 flex-1">
          <div className="space-y-4">
            {topNeighborhoods.map((n, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{n.name}</p>
                  <p className="text-xs text-slate-500">{n.incidents} incidents</p>
                </div>
                <div className={cn(
                  "p-1.5 rounded-lg",
                  n.trend === 'up' ? "bg-rose-500/10 text-rose-400" : 
                  n.trend === 'down' ? "bg-emerald-500/10 text-emerald-400" : 
                  "bg-slate-500/10 text-slate-400"
                )}>
                  {n.trend === 'up' ? <TrendingUp size={14} /> : 
                   n.trend === 'down' ? <TrendingDown size={14} /> : 
                   <Activity size={14} />}
                </div>
              </div>
            ))}
          </div>
        </GlassPane>
        
        <GlassPane className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Emergency Units</h3>
            <span className={cn(
              "px-2 py-1 rounded text-[10px] font-bold",
              emergencyUnits > 0 
                ? "bg-rose-500/20 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse" 
                : "bg-emerald-500/10 text-emerald-400"
            )}>
              {emergencyUnits > 0 ? `${emergencyUnits} ACTIVE` : 'ALL CLEAR'}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            {emergencyUnits > 0 
              ? `${emergencyUnits} unit(s) currently responding to emergencies.`
              : 'No active emergency responses at this time.'}
          </p>
        </GlassPane>
      </div>
    </div>
  );
};
