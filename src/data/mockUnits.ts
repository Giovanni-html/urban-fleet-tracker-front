export interface Unit {
  id: string;
  type: 'PATROL' | 'MEDIC';
  status: 'ACTIVE' | 'EMERGENCY' | 'IDLE';
  location: string;
  lat: number;
  lng: number;
}

// Centered around Curitiba (-25.4290, -49.2670)
export const mockUnits: Unit[] = [
  { id: 'VTR-01', type: 'PATROL', status: 'ACTIVE', location: 'Centro Cívico', lat: -25.4190, lng: -49.2680 },
  { id: 'VTR-05', type: 'PATROL', status: 'ACTIVE', location: 'Batel', lat: -25.4390, lng: -49.2820 },
  { id: 'AMB-10', type: 'MEDIC', status: 'EMERGENCY', location: 'Água Verde', lat: -25.4480, lng: -49.2770 },
  { id: 'VTR-03', type: 'PATROL', status: 'ACTIVE', location: 'Rebouças', lat: -25.4420, lng: -49.2650 },
  { id: 'VTR-08', type: 'PATROL', status: 'ACTIVE', location: 'Jardim Botânico', lat: -25.4430, lng: -49.2400 },
  { id: 'AMB-12', type: 'MEDIC', status: 'EMERGENCY', location: 'Bigorrilho', lat: -25.4320, lng: -49.2950 },
  { id: 'VTR-11', type: 'PATROL', status: 'ACTIVE', location: 'Cabral', lat: -25.4080, lng: -49.2540 },
  { id: 'VTR-14', type: 'PATROL', status: 'ACTIVE', location: 'Alto da Glória', lat: -25.4210, lng: -49.2590 },
  { id: 'AMB-15', type: 'MEDIC', status: 'IDLE', location: 'Cristo Rei', lat: -25.4290, lng: -49.2500 },
  { id: 'VTR-18', type: 'PATROL', status: 'ACTIVE', location: 'Mercês', lat: -25.4250, lng: -49.2890 },
  { id: 'VTR-22', type: 'PATROL', status: 'ACTIVE', location: 'Prado Velho', lat: -25.4520, lng: -49.2520 },
  { id: 'VTR-25', type: 'PATROL', status: 'ACTIVE', location: 'Juvevê', lat: -25.4150, lng: -49.2620 },
  { id: 'AMB-30', type: 'MEDIC', status: 'ACTIVE', location: 'Portão', lat: -25.4680, lng: -49.2880 },
  { id: 'VTR-29', type: 'PATROL', status: 'IDLE', location: 'Ahú', lat: -25.3990, lng: -49.2720 },
  { id: 'VTR-33', type: 'PATROL', status: 'ACTIVE', location: 'Bom Retiro', lat: -25.4120, lng: -49.2780 },
];
