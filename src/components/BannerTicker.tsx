import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BannerTicker: React.FC = () => {
  const { systemSettings } = useApp();

  if (!systemSettings.bannerNotice) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shrink-0">
            <Volume2 size={14} className="text-amber-100" />
            <span>मंडी सूचना</span>
          </div>
          <p className="truncate font-medium text-amber-50">
            {systemSettings.bannerNotice}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-1 shrink-0 text-amber-100 text-xs font-semibold">
          <Sparkles size={14} />
          <span>डिजिटल राजस्थान • डिजिटल भारत</span>
        </div>
      </div>
    </div>
  );
};
