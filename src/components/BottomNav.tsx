import React from 'react';
import { Home, Search, MapPin, User, ShieldCheck, Store, Bookmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAuth }) => {
  const { activeTab, setActiveTab, setSelectedShop, role, currentUser, systemSettings } = useApp();

  const handleNav = (tab: string) => {
    setSelectedShop(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isUserTab = activeTab === 'user_portal' || activeTab === 'customer_dashboard' || activeTab === 'shop_dashboard' || activeTab === 'admin';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-1.5 px-2 sm:px-6">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        
        {/* 1. Home Button (होम - पोस्ट्स व प्रोडक्ट्स) */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'home'
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home size={22} className={activeTab === 'home' ? 'stroke-[2.4]' : 'stroke-2'} />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-semibold truncate max-w-full">
            {systemSettings.navHomeText || 'होम (Home)'}
          </span>
        </button>

        {/* 2. Search & Categories Button (दुकान व श्रेणी सर्च) */}
        <button
          onClick={() => handleNav('search_categories')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'search_categories' || activeTab === 'shops' || activeTab === 'products'
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Search size={22} className={activeTab === 'search_categories' ? 'stroke-[2.4]' : 'stroke-2'} />
            {activeTab === 'search_categories' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-semibold truncate max-w-full">
            {systemSettings.navSearchText || 'सर्च & श्रेणी'}
          </span>
        </button>

        {/* 3. Area / Location / Status Button (दुकान की लोकेशन व स्टेटस) */}
        <button
          onClick={() => handleNav('area_locations')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'area_locations'
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MapPin size={22} className={activeTab === 'area_locations' ? 'stroke-[2.4]' : 'stroke-2'} />
            {activeTab === 'area_locations' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-semibold truncate max-w-full">
            {systemSettings.navAreaText || 'लोकेशन (Area)'}
          </span>
        </button>

        {/* 4. User / Profile / Status Button (यूज़र, सेव प्रोडक्ट व स्टेटस) */}
        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth();
            } else {
              handleNav('user_portal');
            }
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition cursor-pointer ${
            isUserTab
              ? 'text-amber-600 bg-amber-50/80 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            {role === 'admin' ? (
              <ShieldCheck size={22} className={isUserTab ? 'text-amber-600 stroke-[2.4]' : 'stroke-2'} />
            ) : role === 'shopkeeper' ? (
              <Store size={22} className={isUserTab ? 'text-amber-600 stroke-[2.4]' : 'stroke-2'} />
            ) : (
              <User size={22} className={isUserTab ? 'stroke-[2.4]' : 'stroke-2'} />
            )}
            {isUserTab && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-semibold truncate max-w-full">
            {systemSettings.navUserText || (currentUser ? (role === 'admin' ? 'एडमिन' : role === 'shopkeeper' ? 'दुकानदार' : 'प्रोफ़ाइल') : 'लॉगिन')}
          </span>
        </button>

      </div>
    </nav>
  );
};
