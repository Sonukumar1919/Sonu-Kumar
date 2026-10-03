import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  MapPin, 
  Bell, 
  User, 
  PlusCircle, 
  ShieldCheck, 
  Sun, 
  Moon,
  ExternalLink,
  Phone,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenRegisterShop: () => void;
  onOpenNotifications: () => void;
  onOpenCustomizer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAuth, 
  onOpenRegisterShop,
  onOpenNotifications,
  onOpenCustomizer 
}) => {
  const { 
    currentUser, 
    role, 
    activeTab, 
    setActiveTab, 
    notifications,
    systemSettings,
    setSelectedShop,
    setIsGatewayOpen,
    themeMode,
    toggleThemeMode
  } = useApp();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const hiddenKeys = systemSettings.hiddenButtonKeys || [];
  const headerCustomButtons = (systemSettings.customButtons || []).filter(
    b => b.enabled && b.position === 'header'
  );

  const navigate = (tab: string) => {
    setSelectedShop(null);
    setActiveTab(tab);
  };

  const handleCustomButtonClick = (btn: typeof headerCustomButtons[0]) => {
    if (btn.actionType === 'whatsapp') {
      const cleanPhone = btn.target.replace(/\D/g, '');
      window.open(`https://wa.me/91${cleanPhone}`, '_blank');
    } else if (btn.actionType === 'call') {
      window.location.href = `tel:${btn.target}`;
    } else if (btn.actionType === 'url') {
      window.open(btn.target, '_blank');
    } else if (btn.actionType === 'tab') {
      navigate(btn.target);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo - Sleek & Compact */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer select-none group" 
            onClick={() => navigate('home')}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Store size={18} className="stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-950 dark:text-white font-display">
                  {systemSettings.siteName || 'RAWLA'}{' '}
                  <span className="text-amber-600 dark:text-amber-400">{systemSettings.siteNameHighlight || 'MANDI'}</span>
                </span>
                <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  {systemSettings.badgeText || 'बाज़ार'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Icons - Clean, Minimalist, High-Contrast */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            
            {/* Custom Header Buttons from SuperAdmin Button Manager */}
            {headerCustomButtons.map(btn => (
              <button
                key={btn.id}
                onClick={() => handleCustomButtonClick(btn)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                  btn.color === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : btn.color === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : btn.color === 'rose'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <span>{btn.label}</span>
              </button>
            ))}

            {/* 1. Add Shop Button (Hideable / Deletable by SuperAdmin) */}
            {!hiddenKeys.includes('header_add_shop') && (
              <button
                onClick={onOpenRegisterShop}
                className="hidden xs:inline-flex items-center space-x-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition transform hover:-translate-y-0.5 cursor-pointer"
                title={systemSettings.addShopButtonText || 'अपनी दुकान जोड़ें'}
              >
                <PlusCircle size={14} />
                <span>{systemSettings.addShopButtonText || 'दुकान जोड़ें'}</span>
              </button>
            )}

            {/* 2. Dark / Light Theme Toggle (Hideable by SuperAdmin) */}
            {!hiddenKeys.includes('header_theme_toggle') && (
              <button
                onClick={toggleThemeMode}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title={themeMode === 'dark' ? 'लाइट थीम (Light Mode)' : 'डार्क थीम (Dark Mode)'}
              >
                {themeMode === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
              </button>
            )}

            {/* 3. Notifications Bell (Hideable by SuperAdmin) */}
            {!hiddenKeys.includes('header_notifications') && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="सूचनाएँ (Notifications)"
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            )}

            {/* 4. User Profile / Login Button */}
            {currentUser ? (
              <button
                onClick={() => {
                  if (role === 'admin') navigate('admin');
                  else if (role === 'shopkeeper') navigate('shop_dashboard');
                  else navigate('customer_dashboard');
                }}
                className="flex items-center space-x-1.5 bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-left"
                title="प्रोफाइल / डैशबोर्ड"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-[10px] font-black">
                  {role === 'admin' ? <ShieldCheck size={12} /> : currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 bg-slate-950 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <User size={13} />
                <span>लॉगिन</span>
              </button>
            )}

            {/* SuperAdmin Quick Switcher Pill (Only visible to Admin) */}
            {role === 'admin' && (
              <button
                onClick={() => setIsGatewayOpen(true)}
                className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 transition"
                title="रोल गेटवे बदलें"
              >
                <RotateCcw size={15} />
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
