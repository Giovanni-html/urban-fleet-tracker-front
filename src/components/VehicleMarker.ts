// Vehicle marker icons - simple directional arrows with glow effect

export interface VehicleMarkerOptions {
  type: 'PATROL' | 'MEDIC';
  status: 'ACTIVE' | 'EMERGENCY' | 'IDLE';
  bearing: number;
  isFollowing?: boolean;
}

// Create a directional arrow marker element
export function createVehicleMarkerElement(options: VehicleMarkerOptions): HTMLDivElement {
  const { type, status, bearing, isFollowing = false } = options;
  
  // Colors based on type
  const baseColor = type === 'PATROL' ? '#00FFFF' : '#FF4444';
  const glowColor = type === 'PATROL' ? 'rgba(0, 255, 255, 0.6)' : 'rgba(255, 68, 68, 0.6)';
  
  // Status affects opacity/pulse
  const opacity = status === 'IDLE' ? 0.6 : 1;
  const pulseAnimation = status === 'EMERGENCY' ? 'pulse 1s ease-in-out infinite' : 'none';
  
  // Container
  const container = document.createElement('div');
  container.className = 'vehicle-marker-container';
  container.style.cssText = `
    width: 32px;
    height: 32px;
    position: relative;
    cursor: pointer;
    transition: transform 0.1s ease-out;
    transform: rotate(${bearing}deg);
    opacity: ${opacity};
  `;
  
  // Arrow SVG - pointing up (north)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.style.cssText = `
    filter: drop-shadow(0 0 4px ${glowColor}) drop-shadow(0 0 8px ${glowColor});
    animation: ${pulseAnimation};
  `;
  
  // Arrow path pointing up
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 2L4 20h6v2h4v-2h6L12 2z');
  path.setAttribute('fill', baseColor);
  path.setAttribute('stroke', '#ffffff');
  path.setAttribute('stroke-width', '1');
  
  svg.appendChild(path);
  container.appendChild(svg);
  
  // Following indicator (larger glow when being followed)
  if (isFollowing) {
    container.style.filter = `drop-shadow(0 0 12px ${baseColor}) drop-shadow(0 0 20px ${baseColor})`;
    container.style.transform = `rotate(${bearing}deg) scale(1.3)`;
  }
  
  return container;
}

// Update marker rotation
export function updateMarkerBearing(element: HTMLDivElement, bearing: number, isFollowing: boolean = false): void {
  const scale = isFollowing ? 1.3 : 1;
  element.style.transform = `rotate(${bearing}deg) scale(${scale})`;
}

// Add pulse animation styles to document (call once on init)
export function injectVehicleMarkerStyles(): void {
  if (document.getElementById('vehicle-marker-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'vehicle-marker-styles';
  style.textContent = `
    @keyframes pulse {
      0%, 100% { 
        filter: drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor);
        transform: scale(1);
      }
      50% { 
        filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor);
        transform: scale(1.1);
      }
    }
    
    .vehicle-marker-container:hover {
      transform: scale(1.2) !important;
    }
    
    .vehicle-marker-container svg {
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
}
