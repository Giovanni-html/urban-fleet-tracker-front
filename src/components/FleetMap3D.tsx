import { useEffect, useRef, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mockUnits } from '../data/mockUnits';
import { useFleet } from '../context/FleetContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Token from environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} else {
  console.error("Mapbox Token is missing! Add VITE_MAPBOX_TOKEN to your .env file.");
}

// Hazard level colors
const HAZARD_COLORS = {
  HIGH: '#FF4444',   // Vermelho
  MEDIUM: '#FF8800', // Laranja
  LOW: '#FFCC00'     // Amarelo
};

interface FleetMap3DProps {
  onMapLoad?: () => void;
}

export const FleetMap3D = ({ onMapLoad }: FleetMap3DProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  
  // Navigation & Tracking State
  const followingUnitIdRef = useRef<string | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  
  const [isMapReady, setIsMapReady] = useState(false);
  const { neighborhoods, hazardZones } = useFleet();

  // Function to update hazard zones on the map
  const updateHazardZones = useCallback((
    currentNeighborhoods: typeof neighborhoods,
    currentHazardZones: typeof hazardZones
  ) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (currentNeighborhoods.length === 0 || currentHazardZones.length === 0) return;
    
    // Create GeoJSON FeatureCollection from active hazard zones
    const hazardFeatures = currentHazardZones.map(hz => {
      const neighborhood = currentNeighborhoods.find(n => n.id === hz.neighborhoodId);
      if (!neighborhood) {
        console.log(`❌ Neighborhood not found: ${hz.neighborhoodId}`);
        return null;
      }
      
      try {
        const geometry = JSON.parse(neighborhood.geometry);
        return {
          type: 'Feature' as const,
          properties: {
            level: hz.level,
            color: HAZARD_COLORS[hz.level],
            neighborhoodId: hz.neighborhoodId
          },
          geometry
        };
      } catch (e) {
        console.error('Failed to parse geometry:', e);
        return null;
      }
    }).filter(Boolean);

    const hazardGeoJSON = {
      type: 'FeatureCollection' as const,
      features: hazardFeatures
    };

    const source = map.getSource('hazard-zones') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(hazardGeoJSON as any);
    }
  }, []);

  // Use timeout to debounce updates
  useEffect(() => {
    if (isMapReady && neighborhoods.length > 0 && hazardZones.length > 0) {
      const timeoutId = setTimeout(() => {
        updateHazardZones(neighborhoods, hazardZones);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isMapReady, hazardZones, neighborhoods, updateHazardZones]);

  // Keyboard Navigation Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      // Stop following if manual navigation starts
      if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        followingUnitIdRef.current = null;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Animation Loop for smooth keyboard movement
    const updateCamera = () => {
      const map = mapRef.current;
      if (map) {
        const speed = 0.5; // Pan speed
        const rotateSpeed = 1.0; // Rotate speed
        
        const keys = keysPressed.current;
        let dx = 0;
        let dy = 0;
        let bearing = map.getBearing();

        if (keys.has('w') || keys.has('arrowup')) dy += speed;
        if (keys.has('s') || keys.has('arrowdown')) dy -= speed;
        if (keys.has('a') || keys.has('arrowleft')) dx += speed;
        if (keys.has('d') || keys.has('arrowright')) dx -= speed;
        
        if (keys.has('q')) bearing -= rotateSpeed;
        if (keys.has('e')) bearing += rotateSpeed;

        if (dx !== 0 || dy !== 0 || keys.has('q') || keys.has('e')) {
           map.easeTo({
             center: map.getCenter(),
             bearing: bearing,
             duration: 0,
             easing: (t) => t
           });
           map.panBy([-dx * 10, -dy * 10], { duration: 0 }); 
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateCamera);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateCamera);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-49.2733, -25.4284], 
      zoom: 16,
      pitch: 60,
      bearing: -15,
      antialias: true,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      map.setFog({ 'color': '#1A1A1A', 'high-color': '#00FFFF', 'horizon-blend': 0.1, 'space-color': '#0a0a0a', 'star-intensity': 0.1 });

      // Add 3D buildings layer
      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#2a2a2a',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.8
        }
      });
      
      // Initialize Hazard Zones Sources & Layers
      map.addSource('hazard-zones', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
          id: 'hazard-zones-fill',
          type: 'fill',
          source: 'hazard-zones',
          paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.35 }
        }, '3d-buildings');
      map.addLayer({
          id: 'hazard-zones-outline',
          type: 'line',
          source: 'hazard-zones',
          paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-opacity': 0.9 }
        }, '3d-buildings');

      // === GL VEHICLE LAYERS (Replacing Markers for performance & stability) ===
      
      // 1. Add Source
      map.addSource('vehicles', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mockUnits.map(u => ({
            type: 'Feature',
            properties: {
              id: u.id,
              type: u.type,
              status: u.status,
              color: u.type === 'PATROL' ? '#00FFFF' : '#FF4444',
              bearing: 0,
              isTracked: false
            },
            geometry: {
              type: 'Point',
              coordinates: [u.lng, u.lat]
            }
          }))
        }
      });

      // 2. Add Glow Layer (Larger for easier clicking)
      map.addLayer({
        id: 'vehicles-glow',
        type: 'circle',
        source: 'vehicles',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'isTracked'], true],
            0, // Hide if tracked
            12 // Default large glow
          ],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.4,
          'circle-blur': 0.5
        }
      });

      // 3. Add Core Layer (The solid dot)
      map.addLayer({
        id: 'vehicles-core',
        type: 'circle',
        source: 'vehicles',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'isTracked'], true],
            0, // Hide if tracked
            6 // Larger core
          ],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // 4. Add Symbol Layer (Arrow/Chevron)
      map.addLayer({
        id: 'vehicles-symbol',
        type: 'symbol',
        source: 'vehicles',
        layout: {
          'text-field': '➤', 
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // Explicit font
          'text-size': 24,
          'text-rotate': ['-', ['get', 'bearing'], 90], // Adjust rotation: Arrow points Right, so -90 makes it Up (North)
          'text-rotation-alignment': 'map',
          'text-allow-overlap': true,
          'text-ignore-placement': true,
          'text-anchor': 'center'
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
          'text-opacity': [
            'case',
            ['==', ['get', 'isTracked'], true],
            1, // Show if tracked
            0  // Hide otherwise
          ]
        }
      });

      // === INTERACTIONS ===
      // Change cursor on hover
      map.on('mouseenter', 'vehicles-glow', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'vehicles-glow', () => {
        map.getCanvas().style.cursor = '';
      });

      // Click to follow (hit test on the larger glow layer)
      map.on('click', 'vehicles-glow', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const unitId = feature.properties?.id;
        
        if (unitId) {
          followingUnitIdRef.current = unitId;
          
          // Fly to unit immediately
          const coordinates = (feature.geometry as any).coordinates.slice();
          map.flyTo({
            center: coordinates,
            zoom: 19,
            speed: 2.0,
            pitch: 60
          });
          
          // Show popup
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setLngLat(coordinates)
            .setHTML(`<div style="background: #1A1A1A; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px;"><b>${unitId}</b></div>`)
            .addTo(map);
            
          // Close popup after 2s
          setTimeout(() => popup.remove(), 2000);
        }
      });

      // === WEBSOCKET CONNECTION ===
      const socket = new SockJS('http://localhost:8080/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('✅ Connected to WebSocket - Switching to GL Layers');
          stompClient.subscribe('/topic/vehicles', (message) => {
            if (!message.body) return;
            const updates = JSON.parse(message.body);
            
            // Should we update focus?
            const followedId = followingUnitIdRef.current;
            let followTarget: any = null;
            
            // DEBUG LOGGING
            if (followedId) {
                // Check if we are receiving updates for the followed unit
                const found = updates.find((u: any) => u.id === followedId);
                if (!found) {
                    console.warn(`⚠️ Tracking ${followedId} but no update received in this batch!`);
                } else {
                   // console.log(`✅ Tracking ${followedId} - Update received. Lat: ${found.lat}`);
                }
            }

            // Map updates to GeoJSON
            const features = updates.map((update: any) => {
              // Find static info for this unit (color, type)
              const unitStatic = mockUnits.find(u => u.id === update.id);
              const color = unitStatic?.type === 'PATROL' ? '#00FFFF' : '#FF4444';
              
              const isFollowed = String(update.id) === String(followedId);
              if (isFollowed) {
                followTarget = update;
              }

              return {
                type: 'Feature',
                properties: {
                  id: update.id,
                  type: unitStatic?.type || 'UNKNOWN',
                  color: color,
                  bearing: update.bearing || 0,
                  isTracked: isFollowed // Crucial for toggling layers
                },
                geometry: {
                  type: 'Point',
                  coordinates: [update.lng, update.lat]
                }
              };
            });

            const vehiclesGeoJSON = {
              type: 'FeatureCollection',
              features: features
            };

            const source = mapRef.current?.getSource('vehicles') as mapboxgl.GeoJSONSource;
            if (source) {
              source.setData(vehiclesGeoJSON as any);
            }
            
            // Update Camera if following
            if (followTarget && mapRef.current) {
               mapRef.current.easeTo({
                 center: [followTarget.lng, followTarget.lat],
                 bearing: followTarget.bearing, 
                 pitch: 60, // Ensure pitch stays for 3D effect
                 duration: 100, 
                 easing: (t) => t
               });
            }
          });
        }
      });
      
      stompClient.activate();
      stompClientRef.current = stompClient;

      map.once('idle', () => {
        setIsMapReady(true);
        if (onMapLoad) onMapLoad();
      });
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMapLoad]); 

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#1A1A1A] relative">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Hazard Zone Legend */}
      {hazardZones.length > 0 && (
        <div className="absolute bottom-4 right-4 glass-card p-3 z-20">
          <div className="text-xs text-slate-300 mb-2 font-medium">Zonas de Risco</div>
          <div className="flex flex-col gap-1.5">
            {Object.entries(HAZARD_COLORS).map(([level, color]) => {
              const count = hazardZones.filter(hz => hz.level === level).length;
              if (count === 0) return null;
              return (
                <div key={level} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-5 h-5 rounded-full border border-white/30 shadow-sm flex items-center justify-center text-[10px] font-bold text-white" 
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  >
                    {count}
                  </div>
                  <span className="text-slate-400 capitalize">{level.toLowerCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] z-10" />
    </div>
  );
};
