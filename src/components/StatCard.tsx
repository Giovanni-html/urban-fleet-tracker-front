import { GlassPane } from './GlassPane';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  chartData?: number[];
  variant?: 'area' | 'point' | 'bar' | 'arrow';
}

// Cubic Bezier Spline Helper
const getSmoothSvgPath = (points: number[][], height: number) => {
    if (points.length === 0) return "";
    
    // Helper to get control points
    const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
        const p = previous || current;
        const n = next || current;
        const smoothing = 0.2; // 0 to 1
        const line = [n[0] - p[0], n[1] - p[1]];
        const length = Math.sqrt(Math.pow(line[0], 2) + Math.pow(line[1], 2));
        const angle = Math.atan2(line[1], line[0]) + (reverse ? Math.PI : 0);
        const radius = length * smoothing;
        return [current[0] + Math.cos(angle) * radius, current[1] + Math.sin(angle) * radius];
    };

    return points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point[0]},${point[1]}`;
        const cps = getControlPoint(a[i - 1], a[i - 2], point);
        const cpe = getControlPoint(point, a[i - 1], a[i + 1], true);
        return `${acc} C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
    }, "");
};

export const StatCard = ({ title, value, change, trend, chartData = [10, 40, 20, 50, 30, 60, 20], variant = 'area' }: StatCardProps) => {
  const isUp = trend === 'up';
  const colorClass = isUp ? 'text-emerald-400' : 'text-rose-400';
  
  // Chart dimensions (internal SVG units)
  const width = 120;
  const height = 50; 
  const maxVal = Math.max(...chartData, 1);
  const minVal = Math.min(...chartData, 0);
  
  // Normalize data points
  const points = chartData.map((val, i) => {
      const x = (i / (chartData.length - 1)) * width;
      const range = maxVal - minVal || 1;
      const normalizedY = (val - minVal) / range;
      const y = height - (normalizedY * (height * 0.5)) - 10; 
      return [x, y];
  });

  const renderChart = () => {
    switch (variant) {
      case 'point': {
        const pathD = getSmoothSvgPath(points, height);
        const areaPathD = `${pathD} L ${width},${height} L 0,${height} Z`;
        
        return (
          <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
               <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                   <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
               </linearGradient>
            </defs>
            
            {/* Smooth Area Fill */}
            <path 
                d={areaPathD} 
                fill={`url(#grad-${title})`} 
            />

            {/* Smooth Line */}
            <path 
                d={pathD} 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="2" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />
          </svg>
        );
      }

      case 'bar': {
        const sidePadding = 12; // Reduced padding to fit thicker bars
        const availableWidth = width - (sidePadding * 2);
        const barThickness = 9; // Increased thickness (was 6)
        
        return (
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
             <defs>
                <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
                </linearGradient>
             </defs>
             <g>
                {chartData.map((val, i) => {
                    const range = maxVal - minVal || 1;
                    const barH = ((val - minVal) / range) * (height * 0.6) + 10;
                    
                    // Fixed Thickness Logic
                    // Calculate gap to fill space evenly
                    let gap = 0;
                    let startX = sidePadding;

                    if (chartData.length > 1) {
                         const totalBarW = chartData.length * barThickness;
                         const remainingSpace = availableWidth - totalBarW;
                         gap = remainingSpace / (chartData.length - 1);
                         startX = sidePadding + (i * (barThickness + gap));
                    } else {
                        // Center single bar
                        startX = (width / 2) - (barThickness / 2);
                    }
                    
                    // Highlight logic: Max value or absolute last bar (current)
                    const isHighlight = val === maxVal || i === chartData.length - 1;

                    return (
                        <rect 
                            key={i}
                            x={startX}
                            y={height - barH}
                            width={barThickness}
                            height={barH}
                            fill={isHighlight ? "url(#highlightGradient)" : "#475569"}
                            fillOpacity={isHighlight ? 1 : 0.5}
                            rx="2"
                        />
                    );
                })}
             </g>
          </svg>
        );
      }

      case 'arrow':
        // Watermark Trend Arrow (Minimalist)
        return (
          <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
             {isUp ? (
                 // Up Arrow Shape (Geometric)
                 <path 
                    d="M 50,50 L 80,20 L 65,20 L 65,0 L 35,0 L 35,20 L 20,20 Z"
                    fill="currentColor"
                    className="text-emerald-500 opacity-20 transform translate-x-4 translate-y-4"
                 />
             ) : (
                 // Down Arrow Shape
                 <path 
                    d="M 50,0 L 80,30 L 65,30 L 65,50 L 35,50 L 35,30 L 20,30 Z"
                    fill="currentColor"
                    className="text-rose-500 opacity-20 transform translate-x-4 -translate-y-2"
                 />
             )}
          </svg>
        );

      case 'area':
      default:
         const pathSmooth = getSmoothSvgPath(points, height);
         const areaSmooth = `${pathSmooth} L ${width},${height} L 0,${height} Z`;
        return (
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
             <path 
               d={areaSmooth} 
               fill="currentColor" 
               className={`${isUp ? 'text-emerald-500' : 'text-rose-500'} opacity-10`} 
             />
             <path 
               d={pathSmooth}
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               className={isUp ? 'text-emerald-500' : 'text-rose-500'} 
             />
          </svg>
        );
    }
  };

  return (
    <GlassPane className="p-4 relative overflow-hidden bg-slate-900/40 border-slate-700/30 backdrop-blur-xl h-[120px] w-full min-w-[140px] flex flex-col justify-between">
      <div className="flex justify-between items-start z-20 relative">
        <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="flex justify-between items-end z-20 relative mb-1">
        <div>
           <div className="text-3xl font-bold text-white tracking-tight leading-none drop-shadow-sm">{value}</div>
        </div>
        
        <div className={`flex items-center text-xs font-bold gap-1 ${colorClass} bg-slate-950/30 px-1.5 py-0.5 rounded border border-white/5`}>
           {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
           {change}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] z-10 pointer-events-none mix-blend-screen opacity-80">
          {renderChart()}
      </div>
    </GlassPane>
  );
};
