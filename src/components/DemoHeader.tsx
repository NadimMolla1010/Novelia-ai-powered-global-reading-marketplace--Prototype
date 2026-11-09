import React from 'react';
import { UserRole, UserProfile } from '../types';
import { BookOpen, Building2, ShieldCheck, Sparkles, RefreshCw, UserCheck } from 'lucide-react';

interface DemoHeaderProps {
  currentRole: UserRole;
  currentProfile?: UserProfile;
  onSelectRole: (role: UserRole) => void;
  onResetDemoData: () => void;
  onOpenProfile?: () => void;
}

export const DemoHeader: React.FC<DemoHeaderProps> = ({
  currentRole,
  currentProfile,
  onSelectRole,
  onResetDemoData,
  onOpenProfile
}) => {
  return (
    <div className="bg-[#fcfaf5]/95 backdrop-blur-md border-b border-amber-200/60 text-xs text-stone-600 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200 shadow-2xs">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>NOVELIA Prototype v1.0</span>
        </span>
        <span className="hidden lg:inline text-stone-500 font-sans">
          Warm Mediterranean Sunlight & Greek Aegean Blue Theme
        </span>
      </div>

      <div className="flex items-center gap-2">
        {currentProfile && (
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200/90 text-[11px] text-stone-700 hover:text-[#0D5EAF] hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
            title="View user profile and ID details"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#0D5EAF]" />
            <span className="font-semibold">{currentProfile.name}</span>
            <span className="text-[10px] font-mono text-stone-400">({currentProfile.userId})</span>
          </button>
        )}

        <span className="text-stone-400 font-medium hidden md:inline">|</span>

        <div className="inline-flex items-center p-0.5 bg-stone-100/80 rounded-xl border border-stone-200">
          <button
            onClick={() => onSelectRole('reader')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] sm:text-xs ${
              currentRole === 'reader'
                ? 'bg-[#0D5EAF] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reader</span>
          </button>

          <button
            onClick={() => onSelectRole('publisher')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] sm:text-xs ${
              currentRole === 'publisher'
                ? 'bg-[#0D5EAF] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Publisher</span>
          </button>

          <button
            onClick={() => onSelectRole('admin')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg font-medium transition-all cursor-pointer text-[11px] sm:text-xs ${
              currentRole === 'admin'
                ? 'bg-[#0D5EAF] text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        <button
          onClick={onResetDemoData}
          title="Reset sample data and transactions"
          className="p-1 sm:p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
