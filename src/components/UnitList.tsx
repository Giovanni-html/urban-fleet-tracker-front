import { useState } from 'react';
import { Car, Ambulance, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassPane, cn } from './GlassPane';
import { useFleet } from '../context/FleetContext';

const ITEMS_PER_PAGE = 7;

export const UnitList = () => {
  const { filteredUnits } = useFleet();
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const paginatedUnits = filteredUnits.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };
  
  return (
    <GlassPane className="h-full flex flex-col p-6">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Active</h2>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
        <div className="col-span-4">Unit ID</div>
        <div className="col-span-3">Type</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-2 text-right">Location</div>
      </div>

      {/* List (No scroll, paginated) */}
      <div className="flex-1 space-y-3 -mx-2 px-2">
        {paginatedUnits.map((unit, idx) => (
          <div 
            key={`${unit.id}-${idx}`}
            className="group grid grid-cols-12 items-center p-4 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/5 bg-white/[0.02]"
          >
            {/* ID + Icon */}
            <div className="col-span-4 flex items-center gap-3 text-slate-300 group-hover:text-white">
              <div className={cn(
                "p-2 rounded-lg",
                unit.type === 'PATROL' ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              )}>
                {unit.type === 'PATROL' ? <Car size={16} /> : <Ambulance size={16} />}
              </div>
              <span className="font-medium text-sm">{unit.id}</span>
            </div>

            {/* Type */}
            <div className="col-span-3 text-xs text-slate-400 font-medium">
              {unit.type}
            </div>

            {/* Status */}
            <div className="col-span-3">
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-bold border",
                unit.status === 'ACTIVE' 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : unit.status === 'EMERGENCY'
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse"
                    : "bg-slate-500/20 text-slate-300 border-slate-500/30"
              )}>
                {unit.status}
              </span>
            </div>

            {/* Location + Action */}
            <div className="col-span-2 flex items-center justify-end gap-2 text-slate-400">
               <span className="text-xs">{unit.location}</span>
               <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
          <button 
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>
          
          <span className="text-xs text-slate-500">
            {currentPage + 1} / {totalPages}
          </span>
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Próximo
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </GlassPane>
  );
};
