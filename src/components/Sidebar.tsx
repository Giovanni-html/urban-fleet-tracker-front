import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Activity, BarChart3, Settings, Cloud, ArrowRight } from 'lucide-react';
import { GlassPane } from './GlassPane';
import { Logo } from './Logo';

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: Activity, label: 'Activity', path: '/activity' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Cloud, label: 'Weather', path: '/weather' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get active index from current path
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <GlassPane className="h-full w-20 flex flex-col items-center py-6 border-r-0 relative z-50">
      {/* Logo */}
      <div className="mb-10 w-12 h-12">
        <Logo className="w-full h-full" />
      </div>

      {/* Nav Items with Glider Animation */}
      <div 
        className="nav-radio-container flex-1"
        data-active={activeIndex >= 0 ? activeIndex : 0}
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
            onClick={() => navigate(item.path)}
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
