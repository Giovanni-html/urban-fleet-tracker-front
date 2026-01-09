import { useState } from 'react';
import { GlassPane } from './GlassPane';
import { useFleet } from '../context/FleetContext';
import { MapPin, AlertTriangle, Loader2, Check, X } from 'lucide-react';

type HazardLevel = 'HIGH' | 'MEDIUM' | 'LOW';

const levelColors: Record<HazardLevel, { bg: string; text: string; label: string }> = {
  HIGH: { bg: 'bg-red-500/20', text: 'text-red-400', label: '🔴 Alto' },
  MEDIUM: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: '🟠 Médio' },
  LOW: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '🟡 Baixo' }
};

export const SettingsView = () => {
  const { 
    neighborhoods, 
    hazardZones, 
    isLoadingNeighborhoods, 
    createHazardZone, 
    deleteHazardZone 
  } = useFleet();
  
  const [filter, setFilter] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<HazardLevel>('MEDIUM');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter neighborhoods by search
  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.id.toLowerCase().includes(filter.toLowerCase())
  );

  // Get hazard zone for a neighborhood
  const getHazardZone = (neighborhoodId: string) => 
    hazardZones.find(hz => hz.neighborhoodId === neighborhoodId);

  // Toggle hazard zone
  const handleToggle = async (neighborhoodId: string) => {
    setProcessingId(neighborhoodId);
    try {
      const existing = getHazardZone(neighborhoodId);
      if (existing) {
        await deleteHazardZone(existing.id);
      } else {
        await createHazardZone(neighborhoodId, selectedLevel);
      }
    } catch (error) {
      console.error('Failed to toggle hazard zone:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoadingNeighborhoods) {
    return (
      <GlassPane className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </GlassPane>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <GlassPane className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="text-orange-400" />
              Hazard Zones
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Gerencie as zonas de risco da cidade
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              <span className="text-cyan-400 font-bold">{hazardZones.length}</span> zonas ativas
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-white font-bold">{neighborhoods.length}</span> bairros
            </div>
          </div>
        </div>
      </GlassPane>

      {/* Controls */}
      <GlassPane className="p-4 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar bairro..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        
        {/* Level Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Nível padrão:</span>
          {(['HIGH', 'MEDIUM', 'LOW'] as HazardLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedLevel === level 
                  ? `${levelColors[level].bg} ${levelColors[level].text} border border-current` 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {levelColors[level].label}
            </button>
          ))}
        </div>
      </GlassPane>

      {/* Neighborhoods Grid */}
      <GlassPane className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredNeighborhoods.map(neighborhood => {
            const hazardZone = getHazardZone(neighborhood.id);
            const isProcessing = processingId === neighborhood.id;
            
            return (
              <div
                key={neighborhood.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  hazardZone 
                    ? `${levelColors[hazardZone.level].bg} border-current ${levelColors[hazardZone.level].text}` 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
                onClick={() => !isProcessing && handleToggle(neighborhood.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className={hazardZone ? levelColors[hazardZone.level].text : 'text-slate-400'} />
                    <span className={`font-medium ${hazardZone ? 'text-white' : 'text-slate-300'}`}>
                      {neighborhood.id.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isProcessing ? (
                      <Loader2 size={16} className="animate-spin text-cyan-400" />
                    ) : hazardZone ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{levelColors[hazardZone.level].label}</span>
                        <X size={14} className="text-slate-400 hover:text-red-400" />
                      </div>
                    ) : (
                      <Check size={16} className="text-slate-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPane>
    </div>
  );
};
