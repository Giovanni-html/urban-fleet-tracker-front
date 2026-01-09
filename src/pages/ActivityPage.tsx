import { useState } from 'react';
import { GlassPane, cn } from '../components/GlassPane';
import { useFleet } from '../context/FleetContext';
import { 
  Activity, 
  AlertTriangle, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock activity data
const mockActivities = [
  { id: 1, type: 'dispatch', unit: 'VTR-01', location: 'Centro Cívico', time: '10:45', status: 'completed', description: 'Patrulha iniciada' },
  { id: 2, type: 'emergency', unit: 'AMB-10', location: 'Água Verde', time: '10:42', status: 'active', description: 'Emergência médica - Em atendimento' },
  { id: 3, type: 'alert', unit: null, location: 'Batel', time: '10:38', status: 'warning', description: 'Zona de risco atualizada para ALTO' },
  { id: 4, type: 'arrival', unit: 'VTR-05', location: 'Rebouças', time: '10:35', status: 'completed', description: 'Chegou ao destino' },
  { id: 5, type: 'dispatch', unit: 'VTR-03', location: 'Jardim Botânico', time: '10:30', status: 'completed', description: 'Patrulha iniciada' },
  { id: 6, type: 'emergency', unit: 'AMB-12', location: 'Bigorrilho', time: '10:28', status: 'completed', description: 'Emergência resolvida' },
  { id: 7, type: 'alert', unit: null, location: 'Centro', time: '10:25', status: 'info', description: 'Zona de risco removida' },
  { id: 8, type: 'arrival', unit: 'VTR-08', location: 'Alto da Glória', time: '10:22', status: 'completed', description: 'Chegou ao destino' },
  { id: 9, type: 'dispatch', unit: 'VTR-11', location: 'Cabral', time: '10:18', status: 'completed', description: 'Patrulha iniciada' },
  { id: 10, type: 'emergency', unit: 'AMB-15', location: 'Cristo Rei', time: '10:15', status: 'completed', description: 'Emergência resolvida' },
  { id: 11, type: 'dispatch', unit: 'VTR-14', location: 'Mercês', time: '10:10', status: 'completed', description: 'Patrulha iniciada' },
  { id: 12, type: 'alert', unit: null, location: 'Prado Velho', time: '10:05', status: 'warning', description: 'Zona de risco criada - MÉDIO' },
];

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Despachos', value: 'dispatch' },
  { label: 'Emergências', value: 'emergency' },
  { label: 'Alertas', value: 'alert' },
  { label: 'Chegadas', value: 'arrival' },
];

const ITEMS_PER_PAGE = 8;

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'dispatch': return Truck;
    case 'emergency': return AlertTriangle;
    case 'alert': return AlertTriangle;
    case 'arrival': return MapPin;
    default: return Activity;
  }
};

const getActivityColor = (type: string, status: string) => {
  if (status === 'active') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  switch (type) {
    case 'dispatch': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'emergency': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'alert': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'arrival': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 size={14} className="text-emerald-400" />;
    case 'active': return <Activity size={14} className="text-rose-400 animate-pulse" />;
    case 'warning': return <AlertTriangle size={14} className="text-amber-400" />;
    default: return <CheckCircle2 size={14} className="text-slate-400" />;
  }
};

export const ActivityPage = () => {
  const { units } = useFleet();
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const filteredActivities = filter === 'all' 
    ? mockActivities 
    : mockActivities.filter(a => a.type === filter);
  
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  
  const activeEmergencies = mockActivities.filter(a => a.status === 'active').length;
  const todayTotal = mockActivities.length;
  
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6 pb-6">
      {/* Left - Stats Summary */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-cyan-400" size={20} />
          Activity Summary
        </h2>
        
        <GlassPane className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Today's Events</span>
            <span className="text-2xl font-bold text-white">{todayTotal}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-lg font-bold text-cyan-400">{mockActivities.filter(a => a.type === 'dispatch').length}</p>
              <p className="text-[10px] text-slate-400">Despachos</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-lg font-bold text-rose-400">{mockActivities.filter(a => a.type === 'emergency').length}</p>
              <p className="text-[10px] text-slate-400">Emergências</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-lg font-bold text-amber-400">{mockActivities.filter(a => a.type === 'alert').length}</p>
              <p className="text-[10px] text-slate-400">Alertas</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-lg font-bold text-emerald-400">{mockActivities.filter(a => a.type === 'arrival').length}</p>
              <p className="text-[10px] text-slate-400">Chegadas</p>
            </div>
          </div>
        </GlassPane>
        
        {activeEmergencies > 0 && (
          <GlassPane className="p-5 border-rose-500/30 bg-rose-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20">
                <AlertTriangle size={20} className="text-rose-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-300">{activeEmergencies} Emergência Ativa</p>
                <p className="text-xs text-slate-400">Atendimento em andamento</p>
              </div>
            </div>
          </GlassPane>
        )}
        
        <GlassPane className="p-5 flex-1">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Filter size={14} />
            Filtros
          </h3>
          <div className="space-y-2">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setFilter(opt.value); setCurrentPage(0); }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                  filter === opt.value 
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </GlassPane>
      </div>
      
      {/* Right - Activity Log */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Activity Log</h2>
          <span className="text-xs text-slate-500">{filteredActivities.length} eventos</span>
        </div>
        
        <GlassPane className="flex-1 p-5 flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-12 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          
          {/* Activity Items */}
          <div className="flex-1 space-y-2">
            {paginatedActivities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div 
                  key={activity.id}
                  className={cn(
                    "grid grid-cols-12 items-center p-4 rounded-xl transition-all duration-200 cursor-pointer border bg-white/[0.02]",
                    activity.status === 'active' 
                      ? "border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10" 
                      : "border-transparent hover:border-white/5 hover:bg-white/5"
                  )}
                >
                  {/* Type Icon */}
                  <div className="col-span-1">
                    <div className={cn(
                      "p-2 rounded-lg w-fit border",
                      getActivityColor(activity.type, activity.status)
                    )}>
                      <Icon size={14} />
                    </div>
                  </div>
                  
                  {/* Unit */}
                  <div className="col-span-2 text-sm font-medium text-white">
                    {activity.unit || '-'}
                  </div>
                  
                  {/* Location */}
                  <div className="col-span-3 text-sm text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-500" />
                    {activity.location}
                  </div>
                  
                  {/* Description */}
                  <div className="col-span-4 text-sm text-slate-300">
                    {activity.description}
                  </div>
                  
                  {/* Time */}
                  <div className="col-span-1 text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={10} />
                    {activity.time}
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1 flex justify-end">
                    {getStatusIcon(activity.status)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={14} />
                Anterior
              </button>
              
              <span className="text-xs text-slate-500">
                {currentPage + 1} / {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Próximo
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </GlassPane>
      </div>
    </div>
  );
};
