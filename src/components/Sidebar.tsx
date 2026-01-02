import { LayoutGrid, Activity, Settings, Cloud, ArrowRight } from 'lucide-react';
import { GlassPane } from './GlassPane';
import { Logo } from './Logo';
import { useFleet, type ViewType } from '../context/FleetContext';

const navItems: { icon: typeof LayoutGrid; label: string; view: ViewType }[] = [
  { icon: LayoutGrid, label: 'Dashboard', view: 'dashboard' },
  { icon: Activity, label: 'Activity', view: 'activity' },
  { icon: Cloud, label: 'Weather', view: 'weather' },
  { icon: Settings, label: 'Settings', view: 'settings' },
];

export const Sidebar = () => {
  const { activeView, setActiveView } = useFleet();
  
  // Get active index from view name
  const activeIndex = navItems.findIndex(item => item.view === activeView);

  return (
    <GlassPane className="h-full w-20 flex flex-col items-center py-6 border-r-0 relative z-50">
      {/* Logo */}
      <div className="mb-10 w-12 h-12">
        <Logo className="w-full h-full" />
      </div>

      {/* Nav Items with Glider Animation */}
      <div 
        className="nav-radio-container flex-1"
        data-active={activeIndex}
        style={{ '--total-radio': navItems.length } as React.CSSProperties}
      >
        {/* Glider Track and Indicator */}
        <div className="glider-container">
          <div className="glider" />
        </div>

        {/* Nav Items */}
        {navItems.map((item, index) => (
          <div 
            key={index}
            className={`nav-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveView(item.view)}
            title={item.label}
          >
            <div className="icon-wrapper">
              <item.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex flex-col items-center gap-4 text-slate-400 mt-4">
        <div 
          className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all"
          title="Collapse"
        >
          <ArrowRight size={20} />
        </div>
      </div>
    </GlassPane>
  );
};

