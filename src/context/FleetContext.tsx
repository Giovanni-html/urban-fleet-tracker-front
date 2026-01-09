import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { mockUnits, type Unit } from '../data/mockUnits';
import { neighborhoodsApi, hazardZonesApi, type Neighborhood, type HazardZone } from '../services/api';

// Types
export type ViewType = 'dashboard' | 'activity' | 'weather' | 'settings';

interface FleetContextType {
  // Data
  units: Unit[];
  neighborhoods: Neighborhood[];
  hazardZones: HazardZone[];
  
  // Loading states
  isLoadingNeighborhoods: boolean;
  isLoadingHazardZones: boolean;
  
  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Computed
  filteredUnits: Unit[];
  
  // Hazard Zone Actions
  refreshHazardZones: () => Promise<void>;
  createHazardZone: (neighborhoodId: string, level: 'HIGH' | 'MEDIUM' | 'LOW', reason?: string) => Promise<void>;
  deleteHazardZone: (id: string) => Promise<void>;
}

// Context
const FleetContext = createContext<FleetContextType | undefined>(undefined);

// Provider
export const FleetProvider = ({ children }: { children: ReactNode }) => {
  const [units] = useState<Unit[]>(mockUnits);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(true);
  const [isLoadingHazardZones, setIsLoadingHazardZones] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Load neighborhoods on mount
  useEffect(() => {
    const loadNeighborhoods = async () => {
      try {
        const data = await neighborhoodsApi.getAll();
        setNeighborhoods(data);
      } catch (error) {
        console.error('Failed to load neighborhoods:', error);
      } finally {
        setIsLoadingNeighborhoods(false);
      }
    };
    loadNeighborhoods();
  }, []);

  // Load hazard zones on mount
  useEffect(() => {
    refreshHazardZones();
  }, []);

  const refreshHazardZones = async () => {
    setIsLoadingHazardZones(true);
    try {
      const data = await hazardZonesApi.getActive();
      setHazardZones(data);
    } catch (error) {
      console.error('Failed to load hazard zones:', error);
    } finally {
      setIsLoadingHazardZones(false);
    }
  };

  const createHazardZone = async (neighborhoodId: string, level: 'HIGH' | 'MEDIUM' | 'LOW', reason?: string) => {
    try {
      await hazardZonesApi.create({ neighborhoodId, level, reason });
      await refreshHazardZones();
    } catch (error) {
      console.error('Failed to create hazard zone:', error);
      throw error;
    }
  };

  const deleteHazardZone = async (id: string) => {
    try {
      await hazardZonesApi.delete(id);
      await refreshHazardZones();
    } catch (error) {
      console.error('Failed to delete hazard zone:', error);
      throw error;
    }
  };

  // Filter units by search query
  const filteredUnits = units.filter(unit => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      unit.id.toLowerCase().includes(query) ||
      unit.location.toLowerCase().includes(query) ||
      unit.type.toLowerCase().includes(query) ||
      unit.status.toLowerCase().includes(query)
    );
  });

  return (
    <FleetContext.Provider
      value={{
        units,
        neighborhoods,
        hazardZones,
        isLoadingNeighborhoods,
        isLoadingHazardZones,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        filteredUnits,
        refreshHazardZones,
        createHazardZone,
        deleteHazardZone,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

// Hook
export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
