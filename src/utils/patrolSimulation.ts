// Pre-defined patrol routes following real streets in Curitiba
// Each route is an array of [lng, lat] coordinates along major streets

export interface PatrolRoute {
  id: string;
  name: string;
  waypoints: [number, number][]; // [lng, lat][]
}

export interface VehicleState {
  unitId: string;
  initialPosition: [number, number]; // [lng, lat] - center of patrol
  currentAngle: number; // Current angle in radians for circular motion
  speed: number; // Rotation speed (radians per second)
  radius: number; // Patrol radius in degrees
}

// Curitiba patrol routes following main streets
export const PATROL_ROUTES: PatrolRoute[] = [
  {
    id: 'route-centro-civico',
    name: 'Centro Cívico - Batel',
    waypoints: [
      [-49.2680, -25.4190], // Centro Cívico
      [-49.2695, -25.4220], // Av. Cândido de Abreu
      [-49.2720, -25.4280], // Praça Tiradentes
      [-49.2750, -25.4320], // Rua XV de Novembro
      [-49.2780, -25.4380], // Rua Visconde de Nácar
      [-49.2820, -25.4390], // Batel
      [-49.2780, -25.4350], // Volta
      [-49.2720, -25.4280],
      [-49.2680, -25.4190],
    ]
  },
  {
    id: 'route-agua-verde',
    name: 'Água Verde - Portão',
    waypoints: [
      [-49.2770, -25.4480], // Água Verde
      [-49.2800, -25.4520], // Av. República Argentina
      [-49.2850, -25.4580], // Rua Padre Anchieta
      [-49.2880, -25.4680], // Portão
      [-49.2850, -25.4620],
      [-49.2800, -25.4550],
      [-49.2770, -25.4480],
    ]
  },
  {
    id: 'route-jardim-botanico',
    name: 'Jardim Botânico - Prado Velho',
    waypoints: [
      [-49.2400, -25.4430], // Jardim Botânico
      [-49.2450, -25.4460], // Av. Pres. Affonso Camargo
      [-49.2480, -25.4490], 
      [-49.2520, -25.4520], // Prado Velho
      [-49.2500, -25.4550],
      [-49.2460, -25.4510],
      [-49.2420, -25.4470],
      [-49.2400, -25.4430],
    ]
  },
  {
    id: 'route-cabral-juveve',
    name: 'Cabral - Juvevê',
    waypoints: [
      [-49.2540, -25.4080], // Cabral
      [-49.2580, -25.4100], // Av. Paraná
      [-49.2620, -25.4150], // Juvevê
      [-49.2650, -25.4180], // Alto da XV
      [-49.2620, -25.4200],
      [-49.2580, -25.4150],
      [-49.2540, -25.4080],
    ]
  },
  {
    id: 'route-merces-bigorrilho',
    name: 'Mercês - Bigorrilho',
    waypoints: [
      [-49.2890, -25.4250], // Mercês
      [-49.2920, -25.4280], // Rua Fernando Moreira
      [-49.2950, -25.4320], // Bigorrilho
      [-49.2980, -25.4350], // Champagnat
      [-49.2950, -25.4380],
      [-49.2920, -25.4340],
      [-49.2890, -25.4290],
      [-49.2890, -25.4250],
    ]
  },
  {
    id: 'route-ahu-bom-retiro',
    name: 'Ahú - Bom Retiro',
    waypoints: [
      [-49.2720, -25.3990], // Ahú
      [-49.2750, -25.4020], // Av. Anita Garibaldi
      [-49.2780, -25.4080], 
      [-49.2780, -25.4120], // Bom Retiro
      [-49.2750, -25.4080],
      [-49.2720, -25.4040],
      [-49.2720, -25.3990],
    ]
  },
  {
    id: 'route-reboucas-centro',
    name: 'Rebouças - Centro',
    waypoints: [
      [-49.2650, -25.4420], // Rebouças
      [-49.2680, -25.4380], // Av. Sete de Setembro
      [-49.2700, -25.4340],
      [-49.2720, -25.4300], // Centro
      [-49.2700, -25.4260],
      [-49.2680, -25.4300],
      [-49.2660, -25.4360],
      [-49.2650, -25.4420],
    ]
  },
  {
    id: 'route-cristo-rei',
    name: 'Cristo Rei - Jardim Botânico',
    waypoints: [
      [-49.2500, -25.4290], // Cristo Rei
      [-49.2480, -25.4330], // Av. Iguaçu
      [-49.2450, -25.4370],
      [-49.2420, -25.4400], // Jardim Botânico
      [-49.2450, -25.4430],
      [-49.2480, -25.4380],
      [-49.2500, -25.4340],
      [-49.2500, -25.4290],
    ]
  }
];

// Calculate bearing between two points
export function calculateBearing(from: [number, number], to: [number, number]): number {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

// Interpolate between two points
export function interpolatePosition(
  from: [number, number], 
  to: [number, number], 
  progress: number
): [number, number] {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress
  ];
}

// Calculate distance between two points in meters
export function calculateDistance(from: [number, number], to: [number, number]): number {
  const R = 6371000; // Earth radius in meters
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Initialize vehicle state for circular patrol around initial position
export function initializeVehicleState(
  unitId: string, 
  initialPosition: [number, number], // [lng, lat]
  speed: number = 40
): VehicleState {
  // Random starting angle for variety
  const startAngle = Math.random() * Math.PI * 2;
  
  // Speed factor: higher speed = faster rotation (radians per second)
  // ~40km/h car doing a 300m radius circle = about 0.037 rad/s
  const rotationSpeed = (speed / 40) * 0.05;
  
  return {
    unitId,
    initialPosition,
    currentAngle: startAngle,
    speed: rotationSpeed,
    radius: 0.002 // ~200m patrol radius in degrees
  };
}

// Get current position based on vehicle state
export function getVehiclePosition(state: VehicleState): [number, number] {
  const [lng, lat] = state.initialPosition;
  return [
    lng + Math.cos(state.currentAngle) * state.radius,
    lat + Math.sin(state.currentAngle) * state.radius
  ];
}

// Get current bearing (direction of movement)
export function getVehicleBearing(state: VehicleState): number {
  // Tangent to circle: angle + 90 degrees
  const bearing = (state.currentAngle * 180 / Math.PI + 90) % 360;
  return bearing;
}

// Update vehicle state based on elapsed time
export function updateVehicleState(state: VehicleState, deltaMs: number): VehicleState {
  // Update angle based on speed and elapsed time
  const deltaSeconds = deltaMs / 1000;
  const newAngle = state.currentAngle + (state.speed * deltaSeconds);
  
  return {
    ...state,
    currentAngle: newAngle % (Math.PI * 2)
  };
}

