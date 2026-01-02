import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockUnits } from '../data/mockUnits';
import curitibaData from '../data/curitiba.json';

// Token from environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
  console.error("Mapbox Token is missing! Add VITE_MAPBOX_TOKEN to your .env file.");
}

interface FleetMap3DProps {
  onMapLoad?: () => void;
}

export const FleetMap3D = ({ onMapLoad }: FleetMap3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    // Initialize Map with Dark Style and 3D Configuration
    // Navigation locked to Curitiba bounds
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Mapbox Dark template
      center: [-49.2733, -25.4284], // Curitiba, Brazil
      zoom: 16,
      pitch: 60, // 3D perspective - 60 degrees
      bearing: -15,
      antialias: true,
      attributionControl: false,
      // Lock navigation to Curitiba area only
      maxBounds: [
        [-49.4000, -25.6500], // Southwest
        [-49.1500, -25.3000]  // Northeast
      ]
    });

    mapRef.current = map;

    map.on('load', () => {
      // === FOG / ATMOSPHERE EFFECT ===
      map.setFog({
        'color': '#1A1A1A',
        'high-color': '#00FFFF',
        'horizon-blend': 0.1,
        'space-color': '#0a0a0a',
        'star-intensity': 0.1
      });

      // === CURITIBA BOUNDARY MASK ===
      // Everything outside Curitiba is masked (empty)
      const cityBoundaryFeature = curitibaData.features.find(
        (f: any) => f.geometry.type === 'Polygon'
      );
      const cityRing = cityBoundaryFeature?.geometry?.coordinates?.[0] || [
        [-49.4000, -25.3000],
        [-49.1500, -25.3000],
        [-49.1500, -25.6500],
        [-49.4000, -25.6500],
        [-49.4000, -25.3000]
      ];

      // World mask with hole for Curitiba
      const worldMask = {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            // Outer ring (entire world)
            [
              [-180, 90],
              [180, 90],
              [180, -90],
              [-180, -90],
              [-180, 90]
            ],
            // Inner ring (Curitiba - this creates the hole)
            cityRing
          ]
        }
      };

      map.addSource('world-mask', {
        'type': 'geojson',
        'data': worldMask as any
      });

      map.addLayer({
        'id': 'world-mask-layer',
        'type': 'fill',
        'source': 'world-mask',
        'paint': {
          'fill-color': '#0a0a0a', // Near black - empty void
          'fill-opacity': 0.95
        }
      });

      // Curitiba border outline (Cyan glow)
      map.addSource('curitiba-boundary', {
        'type': 'geojson',
        'data': curitibaData as any
      });

      map.addLayer({
        'id': 'curitiba-outline',
        'type': 'line',
        'source': 'curitiba-boundary',
        'paint': {
          'line-color': '#00FFFF',
          'line-width': 2,
          'line-blur': 1,
          'line-opacity': 0.7
        }
      });

      // === 3D BUILDINGS LAYER ===
      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#222222',
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.5, ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.5, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.8
        }
      });

      // === GLOWING VEHICLE MARKERS ===
      mockUnits.forEach((unit) => {
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        
        const isPatrol = unit.type === 'PATROL';
        const color = isPatrol ? '#00FFFF' : '#FF4444';
        
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.background = color;
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #fff';
        el.style.cursor = 'pointer';
        el.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}`;
        el.style.filter = 'brightness(1.3)';

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([unit.lng, unit.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="background: #1A1A1A; color: #fff; padding: 8px; border-radius: 8px;">
                  <strong style="color: ${color}">${unit.id}</strong><br/>
                  <span style="color: #888">${unit.type} • ${unit.status}</span>
                </div>
              `)
          )
          .addTo(map);

        markersRef.current.push(marker);
      });

      // === SIGNAL LOADING COMPLETE ===
      // Wait for first idle event (initial tiles loaded) + fixed buffer
      // for 3D buildings and GPU rendering to complete
      map.once('idle', () => {
        // 3 second buffer ensures 3D buildings are fully rendered
        setTimeout(() => {
          if (onMapLoad) onMapLoad();
        }, 3000);
      });
    });

    // === WASD + QE KEYBOARD NAVIGATION ===
    const keysPressed = new Set<string>();
    let animationFrameId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      keysPressed.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());
    };

    const animate = () => {
      if (mapRef.current && keysPressed.size > 0) {
        const PAN_SPEED = 15;
        const ROTATE_SPEED = 1;

        let dx = 0;
        let dy = 0;
        let dbearing = 0;

        // WASD for panning
        if (keysPressed.has('w')) dy -= PAN_SPEED;
        if (keysPressed.has('s')) dy += PAN_SPEED;
        if (keysPressed.has('a')) dx -= PAN_SPEED;
        if (keysPressed.has('d')) dx += PAN_SPEED;
        
        // QE for rotation
        if (keysPressed.has('q')) dbearing -= ROTATE_SPEED;
        if (keysPressed.has('e')) dbearing += ROTATE_SPEED;

        if (dx !== 0 || dy !== 0) {
          mapRef.current.panBy([dx, dy], { easing: t => t, duration: 0 });
        }
        if (dbearing !== 0) {
          mapRef.current.setBearing(mapRef.current.getBearing() + dbearing);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapLoad]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#1A1A1A] relative">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] z-10" />
    </div>
  );
};
