import React from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  Shirt, 
  Footprints, 
  ShoppingBasket, 
  HeartPulse, 
  UtensilsCrossed, 
  Wrench, 
  Armchair, 
  Smartphone, 
  Car, 
  Hammer, 
  Grid 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP_CATEGORIES, RAWLA_AREAS } from '../data/constants';

const categoryIconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone size={18} />,
  Shirt: <Shirt size={18} />,
  Footprints: <Footprints size={18} />,
  ShoppingBasket: <ShoppingBasket size={18} />,
  HeartPulse: <HeartPulse size={18} />,
  UtensilsCrossed: <UtensilsCrossed size={18} />,
  Wrench: <Wrench size={18} />,
  Armchair: <Armchair size={18} />,
  Sparkles: <Sparkles size={18} />,
  Car: <Car size={18} />,
  Hammer: <Hammer size={18} />,
  Grid: <Grid size={18} />
};

export const HeroSearch: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedArea, 
    setSelectedArea,
    shops,
    products,
    posts,
    setActiveTab
  } = useApp();

  const activeShopsCount = shops.filter(s => s.status === 'active').length;

  return (
    <div className="relative bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-6 sm:pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-amber-100">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-amber-100/80 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
          <Sparkles size={14} className="text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span>रावला मंडी का अपना डिजिटल बाज़ार व लोकल डायरेक्टरी</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          रावला मंडी की <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">सभी दुकानें</span> अब आपकी जेब में
        </h1>
        
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-medium">
          दुकानें खोजें, मोबाइल नंबर व WhatsApp पर सीधे संपर्क करें, ताज़ा प्रोडक्ट्स और दैनिक ऑफर्स देखें।
        </p>

        {/* Unified Search Input Box */}
        <div className="max-w-3xl mx-auto pt-2">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-amber-950/5 border border-slate-200/90 p-2 sm:p-2.5 transition focus-within:ring-2 focus-within:ring-amber-500/50 focus-within:border-amber-500">
            <div className="pl-2 sm:pl-3 text-amber-600">
              <Search size={22} />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="दुकान, सामान या पोस्ट खोजें... (जैसे: Mobile, कपड़े, खाद, रसगुल्ले)"
              className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                साफ़ करें
              </button>
            )}

            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  setActiveTab('shops');
                }
              }}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-600/30 transition shrink-0 cursor-pointer"
            >
              खोजें
            </button>
          </div>
        </div>

        {/* Area quick selection tags */}
        <div className="pt-2 flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-xs">
          <span className="text-slate-500 font-medium flex items-center mr-1">
            <MapPin size={13} className="mr-1 text-amber-600" />
            प्रमुख क्षेत्र:
          </span>
          {RAWLA_AREAS.slice(0, 6).map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-2.5 py-1 rounded-full font-medium transition cursor-pointer ${
                selectedArea === area 
                  ? 'bg-amber-600 text-white shadow-xs font-semibold' 
                  : 'bg-white hover:bg-amber-50 text-slate-600 border border-slate-200'
              }`}
            >
              {area.replace(/\s\(.*/, '')}
            </button>
          ))}
        </div>

        {/* Quick Market Stats Counter */}
        <div className="pt-4 grid grid-cols-3 max-w-lg mx-auto bg-white/80 backdrop-blur-xs rounded-2xl border border-amber-100 p-2.5 text-center shadow-xs">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-amber-700">{activeShopsCount}</div>
            <div className="text-[11px] text-slate-500 font-medium">सक्रिय दुकानें</div>
          </div>
          <div className="border-x border-slate-100">
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700">{products.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">उपलब्ध प्रोडक्ट्स</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-orange-700">{posts.length}</div>
            <div className="text-[11px] text-slate-500 font-medium">ताज़ा ऑफर्स</div>
          </div>
        </div>

      </div>

      {/* Shop Categories Grid Bar */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
            <Tag size={18} className="text-amber-600 mr-2" />
            दुकान श्रेणियां (Shop Categories)
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              सभी श्रेणियाँ देखें
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 sm:gap-2.5">
          {/* 'All' button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition border text-center cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                : 'bg-white hover:bg-amber-50/80 text-slate-700 border-slate-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${
              selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
            }`}>
              <Store size={18} />
            </div>
            <span className="text-[11px] sm:text-xs font-bold truncate max-w-full">
              सभी दुकानें
            </span>
          </button>

          {SHOP_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.label || selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.label)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition border text-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30 scale-102'
                    : 'bg-white hover:bg-amber-50/80 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {categoryIconMap[cat.icon] || <Store size={18} />}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold truncate max-w-full leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
