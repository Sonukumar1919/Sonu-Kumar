import React from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  Store, 
  RefreshCw, 
  Key, 
  Box, 
  CheckCircle2,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RAWLA_AREAS } from '../data/constants';

export const HeroSearch: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCondition,
    setSelectedCondition,
    selectedArea, 
    setSelectedArea,
    shops,
    products,
    posts,
    setActiveTab
  } = useApp();

  const activeShopsCount = shops.filter(s => s.status === 'active').length;

  const newProductsCount = products.filter(p => !p.condition || p.condition === 'new').length;
  const usedProductsCount = products.filter(p => p.condition === 'used').length;
  const rentProductsCount = products.filter(p => p.condition === 'rent').length;

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
          दुकानें खोजें, मोबाइल नंबर व WhatsApp पर सीधे संपर्क करें, नया, पुराना व किराये पर मिलने वाला सामान देखें।
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
              placeholder="दुकान, नया, पुराना या किराये का सामान खोजें... (उदा. iPhone, ट्रैक्टर, स्प्रे मशीन)"
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
                  setActiveTab('products');
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

      {/* 🌟 Mandatory Product Condition Selector Bar (Replacing Old Shop Categories Grid) */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="text-center mb-4">
          <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            सामान फ़िल्टर करें (Product Types)
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 font-display">
            नया, पुराना या किराये का सामान चुनें
          </h2>
          <p className="text-xs text-slate-500">रावला मंडी के दुकानदारों द्वारा उपलब्ध कराया गया सामान</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* All Products */}
          <button
            onClick={() => setSelectedCondition('all')}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
              selectedCondition === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-slate-900/50'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              selectedCondition === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
            }`}>
              <Box size={20} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">सभी सामान</div>
              <div className={`text-[10px] font-medium mt-0.5 ${selectedCondition === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
                {products.length} कुल सामान
              </div>
            </div>
          </button>

          {/* New Products */}
          <button
            onClick={() => setSelectedCondition('new')}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
              selectedCondition === 'new'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl ring-2 ring-emerald-500/50'
                : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 border-emerald-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              selectedCondition === 'new' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">✨ नया सामान (New)</div>
              <div className={`text-[10px] font-medium mt-0.5 ${selectedCondition === 'new' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                {newProductsCount} नए प्रोडक्ट्स
              </div>
            </div>
          </button>

          {/* Used / Second-Hand Products */}
          <button
            onClick={() => setSelectedCondition('used')}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
              selectedCondition === 'used'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xl ring-2 ring-amber-500/50'
                : 'bg-amber-50/50 hover:bg-amber-50 text-amber-950 border-amber-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              selectedCondition === 'used' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <RefreshCw size={20} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">🔄 पुराना / 2nd Hand</div>
              <div className={`text-[10px] font-medium mt-0.5 ${selectedCondition === 'used' ? 'text-amber-100' : 'text-amber-800'}`}>
                {usedProductsCount} पुराने प्रोडक्ट्स
              </div>
            </div>
          </button>

          {/* Rental Products */}
          <button
            onClick={() => setSelectedCondition('rent')}
            className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-2 relative overflow-hidden ${
              selectedCondition === 'rent'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xl ring-2 ring-purple-500/50'
                : 'bg-purple-50/50 hover:bg-purple-50 text-purple-950 border-purple-200'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              selectedCondition === 'rent' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
            }`}>
              <Key size={20} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold">🔑 किराये पर (Rent)</div>
              <div className={`text-[10px] font-medium mt-0.5 ${selectedCondition === 'rent' ? 'text-purple-100' : 'text-purple-800'}`}>
                {rentProductsCount} किराये के सामान
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

