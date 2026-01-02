// Hazard zones in Curitiba - areas with higher incident rates
export const hazardZones = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Centro - Alta Criminalidade',
        level: 'high'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-49.2750, -25.4250],
          [-49.2650, -25.4250],
          [-49.2650, -25.4350],
          [-49.2750, -25.4350],
          [-49.2750, -25.4250]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Boqueirão - Zona de Risco',
        level: 'medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-49.2400, -25.4800],
          [-49.2300, -25.4800],
          [-49.2300, -25.4900],
          [-49.2400, -25.4900],
          [-49.2400, -25.4800]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'CIC - Área Industrial',
        level: 'medium'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-49.3400, -25.4600],
          [-49.3250, -25.4600],
          [-49.3250, -25.4750],
          [-49.3400, -25.4750],
          [-49.3400, -25.4600]
        ]]
      }
    }
  ]
};
