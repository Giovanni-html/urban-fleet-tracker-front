// API Service for Urban Fleet Tracker
const API_BASE_URL = 'http://localhost:8080/api';

// Types
export interface Neighborhood {
  id: string;
  geometry: string; // JSON string of GeoJSON geometry
  regionName: string;
}

export interface HazardZone {
  id: string;
  neighborhoodId: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  active: boolean;
}

export interface CreateHazardZoneRequest {
  neighborhoodId: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  reason?: string;
}

// Neighborhoods API
export const neighborhoodsApi = {
  getAll: async (): Promise<Neighborhood[]> => {
    const response = await fetch(`${API_BASE_URL}/neighborhoods`);
    if (!response.ok) throw new Error('Failed to fetch neighborhoods');
    return response.json();
  },

  getById: async (id: string): Promise<Neighborhood> => {
    const response = await fetch(`${API_BASE_URL}/neighborhoods/${id}`);
    if (!response.ok) throw new Error('Failed to fetch neighborhood');
    return response.json();
  },

  getCount: async (): Promise<{ count: number }> => {
    const response = await fetch(`${API_BASE_URL}/neighborhoods/count`);
    if (!response.ok) throw new Error('Failed to fetch count');
    return response.json();
  }
};

// Hazard Zones API
export const hazardZonesApi = {
  getAll: async (): Promise<HazardZone[]> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones`);
    if (!response.ok) throw new Error('Failed to fetch hazard zones');
    return response.json();
  },

  getActive: async (): Promise<HazardZone[]> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones/active`);
    if (!response.ok) throw new Error('Failed to fetch active hazard zones');
    return response.json();
  },

  create: async (data: CreateHazardZoneRequest): Promise<HazardZone> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create hazard zone');
    return response.json();
  },

  update: async (id: string, data: Partial<HazardZone>): Promise<HazardZone> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update hazard zone');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete hazard zone');
  },

  deactivate: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/hazard-zones/${id}/deactivate`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to deactivate hazard zone');
  }
};

// Units API
export const unitsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/units`);
    if (!response.ok) throw new Error('Failed to fetch units');
    return response.json();
  },

  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/units/statistics`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }
};
