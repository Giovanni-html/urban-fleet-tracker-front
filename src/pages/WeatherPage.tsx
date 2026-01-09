import { GlassPane, cn } from '../components/GlassPane';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Gauge,
  Umbrella,
  AlertTriangle,
  CloudSun,
  Moon
} from 'lucide-react';

// Mock weather data for Curitiba
const currentWeather = {
  temp: 22,
  feelsLike: 20,
  condition: 'Parcialmente Nublado',
  humidity: 68,
  wind: 15,
  visibility: 10,
  pressure: 1015,
  uvIndex: 6,
  precipitation: 20,
};

const hourlyForecast = [
  { time: '12:00', temp: 22, icon: CloudSun, precip: 10 },
  { time: '13:00', temp: 24, icon: Sun, precip: 5 },
  { time: '14:00', temp: 25, icon: Sun, precip: 5 },
  { time: '15:00', temp: 24, icon: CloudSun, precip: 15 },
  { time: '16:00', temp: 23, icon: Cloud, precip: 30 },
  { time: '17:00', temp: 21, icon: CloudRain, precip: 60 },
  { time: '18:00', temp: 19, icon: CloudRain, precip: 70 },
  { time: '19:00', temp: 18, icon: Cloud, precip: 40 },
];

const dailyForecast = [
  { day: 'Hoje', high: 25, low: 17, icon: CloudSun, precip: 40, condition: 'Pancadas à tarde' },
  { day: 'Sex', high: 23, low: 16, icon: CloudRain, precip: 70, condition: 'Chuva' },
  { day: 'Sáb', high: 20, low: 14, icon: CloudLightning, precip: 85, condition: 'Tempestade' },
  { day: 'Dom', high: 22, low: 15, icon: Cloud, precip: 30, condition: 'Nublado' },
  { day: 'Seg', high: 26, low: 17, icon: Sun, precip: 10, condition: 'Ensolarado' },
  { day: 'Ter', high: 27, low: 18, icon: Sun, precip: 5, condition: 'Ensolarado' },
  { day: 'Qua', high: 25, low: 17, icon: CloudSun, precip: 20, condition: 'Parcialmente nublado' },
];

const weatherAlerts = [
  { type: 'warning', title: 'Alerta de Tempestade', description: 'Tempestade prevista para sábado. Reforce as patrulhas em zonas de risco.', time: 'Sábado 14:00 - 20:00' },
  { type: 'info', title: 'Ventos Fortes', description: 'Rajadas de vento de até 50km/h esperadas para sexta-feira.', time: 'Sexta-feira 16:00' },
];

const WeatherIcon = ({ icon: Icon, size = 24, className = '' }: { icon: typeof Sun, size?: number, className?: string }) => (
  <Icon size={size} className={className} />
);

const MetricCard = ({ icon: Icon, label, value, unit }: { icon: typeof Wind, label: string, value: string | number, unit?: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]">
    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-white">{value}{unit && <span className="text-slate-400 text-xs ml-1">{unit}</span>}</p>
    </div>
  </div>
);

export const WeatherPage = () => {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 overflow-y-auto">
      {/* Left Column - Current Weather */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cloud className="text-cyan-400" size={20} />
          Curitiba, PR
        </h2>
        
        {/* Main Weather Card */}
        <GlassPane className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-6xl font-bold text-white">{currentWeather.temp}°</p>
              <p className="text-slate-400 mt-1">Sensação {currentWeather.feelsLike}°</p>
            </div>
            <div className="text-right">
              <CloudSun size={64} className="text-cyan-400" />
              <p className="text-sm text-slate-300 mt-2">{currentWeather.condition}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={Droplets} label="Umidade" value={currentWeather.humidity} unit="%" />
            <MetricCard icon={Wind} label="Vento" value={currentWeather.wind} unit="km/h" />
            <MetricCard icon={Eye} label="Visibilidade" value={currentWeather.visibility} unit="km" />
            <MetricCard icon={Gauge} label="Pressão" value={currentWeather.pressure} unit="hPa" />
          </div>
        </GlassPane>
        
        {/* Precipitation Chance */}
        <GlassPane className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Umbrella size={16} className="text-cyan-400" />
              Chance de Chuva
            </h3>
            <span className="text-2xl font-bold text-cyan-400">{currentWeather.precipitation}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${currentWeather.precipitation}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-3">Pancadas de chuva previstas para o final da tarde.</p>
        </GlassPane>
        
        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Alertas Meteorológicos
            </h3>
            {weatherAlerts.map((alert, idx) => (
              <GlassPane 
                key={idx} 
                className={cn(
                  "p-4 border",
                  alert.type === 'warning' 
                    ? "border-amber-500/30 bg-amber-500/5" 
                    : "border-cyan-500/20 bg-cyan-500/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    alert.type === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
                  )}>
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.description}</p>
                    <p className="text-[10px] text-slate-500 mt-2">{alert.time}</p>
                  </div>
                </div>
              </GlassPane>
            ))}
          </div>
        )}
      </div>
      
      {/* Middle Column - Hourly Forecast */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Previsão por Hora</h2>
        
        <GlassPane className="p-5 flex-1">
          <div className="space-y-3">
            {hourlyForecast.map((hour, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-colors",
                  idx === 0 ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/[0.02] hover:bg-white/5"
                )}
              >
                <span className="text-sm text-slate-400 w-14">{hour.time}</span>
                <WeatherIcon icon={hour.icon} size={20} className="text-slate-300" />
                <span className="text-lg font-semibold text-white w-12 text-right">{hour.temp}°</span>
                <div className="flex items-center gap-1 w-12 justify-end">
                  <Droplets size={12} className="text-cyan-400" />
                  <span className="text-xs text-slate-500">{hour.precip}%</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPane>
      </div>
      
      {/* Right Column - Daily Forecast */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Previsão 7 Dias</h2>
        
        <GlassPane className="p-5 flex-1">
          <div className="space-y-3">
            {dailyForecast.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl transition-colors",
                  idx === 0 ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/[0.02] hover:bg-white/5"
                )}
              >
                <span className="text-sm font-medium text-white w-12">{day.day}</span>
                <WeatherIcon icon={day.icon} size={24} className="text-slate-300" />
                <div className="flex-1">
                  <p className="text-xs text-slate-400">{day.condition}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets size={12} className="text-cyan-400" />
                  <span className="text-xs text-slate-500 w-8">{day.precip}%</span>
                </div>
                <div className="flex items-center gap-2 w-20 justify-end">
                  <span className="text-sm font-semibold text-white">{day.high}°</span>
                  <span className="text-sm text-slate-500">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPane>
        
        {/* Fleet Impact */}
        <GlassPane className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Impacto nas Operações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Condições de direção</span>
              <span className="text-xs font-medium text-emerald-400">Boas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Visibilidade noturna</span>
              <span className="text-xs font-medium text-emerald-400">Normal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Risco de alagamento</span>
              <span className="text-xs font-medium text-amber-400">Moderado (Sáb)</span>
            </div>
          </div>
        </GlassPane>
      </div>
    </div>
  );
};
