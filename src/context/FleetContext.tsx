import { createContext, useContext, useState, type ReactNode } from 'react';
import { mockUnits, type Unit } from '../data/mockUnits';

// Types
export type ViewType = 'dashboard' | 'activity' | 'weather' | 'settings';

interface FleetContextType {
  // Data
  units: Unit[];
  
  // Navigation
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Computed
  filteredUnits: Unit[];
}

// Context
const FleetContext = createContext<FleetContextType | undefined>(undefined);

// Provider
export const FleetProvider = ({ children }: { children: ReactNode }) => {
  const [units] = useState<Unit[]>(mockUnits);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

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
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        filteredUnits,
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
