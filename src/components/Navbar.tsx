import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  MapPin, 
  Bell, 
  User, 
  PlusCircle, 
  Menu, 
  X, 
  LogOut, 
  ShieldCheck, 
  ShoppingBag, 
  Megaphone, 
  Heart,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RAWLA_AREAS } from '../data/constants';

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
    selectedArea, 
    setSelectedArea, 
    notifications,
    systemSettings,
    logout,
    setSelectedShop,
    openCustomizerForField,
    setIsGatewayOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navigate = (tab: string) => {
    setSelectedShop(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      {/* Top micro bar for town context & quick persona selector */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate pr-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="font-medium tracking-wide truncate">
            {systemSettings.tickerNotice || '🌾 श्रीगंगानगर ज़िले की अग्रणी कृषि मंडी — रावला मंडी (Rawla Mandi)'}
          </span>
        </div>

        {/* Role Gateway Status Badge & Super Admin Quick Customizer */}
        <div className="flex items-center space-x-2 shrink-0">
          {role === 'admin' && (
            <button
              onClick={() => setIsGatewayOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black transition flex items-center space-x-1 cursor-pointer shadow-xs"
              title="मुख्य गेटवे / भूमिका बदलें"
            >
              <span>🔄 भूमिका बदलें (Gateway)</span>
            </button>
          )}

          <span className="bg-black/20 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white">
            {role === 'admin' ? '🛡️ सुपर एडमिन' : role === 'shopkeeper' ? '🏪 दुकानदार' : '👤 ग्राहक'}
          </span>

          {role === 'admin' && onOpenCustomizer && (
            <button
              onClick={onOpenCustomizer}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              title="वेबसाइट का कोई भी नाम या बटन टेक्स्ट बदलें"
            >
              <span>✏️ नाम/बटन बदलें</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Super Admin Live Notice / Broadcast Header Bar (Visible to everyone, editable by Super Admin) */}
        {systemSettings.headerCustomNotice && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-b border-amber-200/80 px-3 py-1.5 flex items-center justify-between text-xs text-slate-800 font-semibold">
            <div className="flex items-center space-x-2 truncate">
              <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 shadow-2xs">
                📢 सुपर एडमिन सूचना
              </span>
              <span className="truncate text-slate-900 font-bold">{systemSettings.headerCustomNotice}</span>
            </div>

            {role === 'admin' && (
              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                <button
                  onClick={() => openCustomizerForField('branding', 'headerCustomNotice')}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer flex items-center space-x-1"
                  title="यहाँ जो भी लिखें वह सभी को लाइव दिखेगा"
                >
                  <span>✏️ हेडर मैसेज बदलें</span>
                </button>
                <button
                  onClick={() => openCustomizerForField('layout')}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer flex items-center space-x-1"
                  title="बॉक्स का आकार (Box Size) व स्टाइल बदलें"
                >
                  <span>📐 बॉक्स साइज़ बदलें</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/30">
              <Store size={24} className="stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                  {systemSettings.siteName || 'RAWLA'}{' '}
                  <span className="text-amber-600">{systemSettings.siteNameHighlight || 'MANDI'}</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  {systemSettings.badgeText || 'लोकल बाज़ार'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium font-hindi">
                {systemSettings.siteTagline || 'स्थानीय डिजिटल बाज़ार'}
              </p>
            </div>
          </div>

          {/* Clean Actions: Add Shop, Notifications, Profile/Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Add Shop CTA */}
            <button
              onClick={onOpenRegisterShop}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>{systemSettings.addShopButtonText || 'अपनी दुकान जोड़ें'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
              title="सूचनाएँ (Notifications)"
            >
              <Bell size={19} />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* User Profile / Dashboard / Login */}
            {currentUser ? (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (role === 'admin') navigate('admin');
                    else if (role === 'shopkeeper') navigate('shop_dashboard');
                    else navigate('customer_dashboard');
                  }}
                  className="flex items-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[11px] font-bold">
                    {role === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                <User size={14} />
                <span>लॉगिन</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Area Filter */}
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2">
            <MapPin size={18} className="text-amber-600 mr-2 shrink-0" />
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-transparent text-sm font-medium text-slate-800 w-full focus:outline-none"
            >
              {RAWLA_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => navigate('home')}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition ${
                activeTab === 'home' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              🏠 होम (Home)
            </button>
            <button
              onClick={() => navigate('shops')}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition ${
                activeTab === 'shops' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              🏪 सभी दुकानें
            </button>
            <button
              onClick={() => navigate('products')}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition ${
                activeTab === 'products' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              📦 प्रोडक्ट्स
            </button>
            <button
              onClick={() => navigate('posts')}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition ${
                activeTab === 'posts' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-700'
              }`}
            >
              📢 ताज़ा पोस्ट्स
            </button>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegisterShop();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold shadow-md"
          >
            <PlusCircle size={18} />
            <span>अपनी दुकान जोड़ें (Register Shop)</span>
          </button>

          {currentUser && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {currentUser.name} ({role})
              </span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-semibold"
              >
                लॉगआउट करें
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
