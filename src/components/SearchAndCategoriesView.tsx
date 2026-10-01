import React from 'react';
import { Search, Tag, Store, ShoppingBag, ShieldCheck, MapPin, Phone, MessageCircle, ArrowRight, Sparkles, RefreshCw, Key, Box } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP_CATEGORIES } from '../data/constants';
import { Shop } from '../types';

interface SearchAndCategoriesViewProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  onOpenRegisterShop: () => void;
}

export const SearchAndCategoriesView: React.FC<SearchAndCategoriesViewProps> = ({
  onSelectShop,
  onOpenAuth,
  onOpenRegisterShop
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    selectedCondition,
    setSelectedCondition,
    shops, 
    products 
  } = useApp();

  // Filter shops
  const filteredShops = shops.filter(shop => {
    if (shop.status !== 'active') return false;

    if (selectedCategory !== 'all' && shop.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = shop.shopName.toLowerCase().includes(q);
      const matchCat = shop.category.toLowerCase().includes(q);
      const matchDesc = shop.description.toLowerCase().includes(q);
      const matchOwner = shop.ownerName.toLowerCase().includes(q);
      const matchArea = shop.area.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc && !matchOwner && !matchArea) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          🔍 दुकान खोजें व श्रेणियां (Search & Categories)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          दुकान का नाम या सामान लिखकर सर्च करें, अथवा नीचे दी गई श्रेणियों में से चुनें।
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-slate-200 p-2.5 focus-within:ring-2 focus-within:ring-amber-500">
          <Search size={22} className="text-amber-600 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="दुकान, नया, पुराना या किराये का सामान खोजें... (उदा. Sharma Mobile, ट्रॅक्टर, लहेँगा)"
            className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 font-semibold"
            >
              साफ़ करें
            </button>
          )}
        </div>
      </div>

      {/* 🌟 Product Condition Filter Bar (नया / पुराना / किराये पर) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
            <Sparkles size={18} className="text-amber-600 mr-2" />
            <span>सामान फ़िल्टर (Product Condition)</span>
          </h2>
          {selectedCondition !== 'all' && (
            <button
              onClick={() => setSelectedCondition('all')}
              className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
            >
              सभी सामान दिखाएं
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setSelectedCondition('all')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center space-x-2 ${
              selectedCondition === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Box size={18} />
            <span className="text-xs font-bold">सभी सामान ({products.length})</span>
          </button>

          <button
            onClick={() => setSelectedCondition('new')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center space-x-2 ${
              selectedCondition === 'new'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}
          >
            <Sparkles size={18} />
            <span className="text-xs font-bold">✨ नया (New)</span>
          </button>

          <button
            onClick={() => setSelectedCondition('used')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center space-x-2 ${
              selectedCondition === 'used'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md font-bold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
          >
            <RefreshCw size={18} />
            <span className="text-xs font-bold">🔄 पुराना / 2nd Hand</span>
          </button>

          <button
            onClick={() => setSelectedCondition('rent')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center space-x-2 ${
              selectedCondition === 'rent'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md font-bold'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
            }`}
          >
            <Key size={18} />
            <span className="text-xs font-bold">🔑 किराये पर (Rent)</span>
          </button>
        </div>
      </div>

      {/* 📂 Shop Categories Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
            <Tag size={18} className="text-amber-600 mr-2" />
            <span>दुकान श्रेणियां (Shop Categories)</span>
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              सभी दुकानें दिखाएं
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md font-bold'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
            }`}
          >
            <Store size={22} className="mb-1" />
            <span className="text-xs font-bold">सभी श्रेणियां</span>
            <span className="text-[10px] opacity-80 mt-0.5">{shops.filter(s => s.status === 'active').length} दुकानें</span>
          </button>

          {SHOP_CATEGORIES.map(cat => {
            const count = shops.filter(s => s.status === 'active' && s.category === cat.label).length;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.label)}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md font-bold scale-102'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                <Tag size={20} className="mb-1" />
                <span className="text-xs font-bold truncate max-w-full">{cat.label}</span>
                <span className="text-[10px] opacity-80 mt-0.5">{count} दुकानें</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Shops List */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">
            दुकानों की सूची ({filteredShops.length} दुकानें)
          </h3>
          {selectedCategory !== 'all' && (
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
              फ़िल्टर: {selectedCategory}
            </span>
          )}
        </div>

        {filteredShops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <Store size={36} className="text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">इस खोज या श्रेणी में कोई दुकान नहीं मिली</p>
            <p className="text-xs text-slate-400">कृपया अन्य श्रेणी चुनें या सर्च शब्द बदलें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => onSelectShop(shop)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80'}
                    alt={shop.shopName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center space-x-1">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">{shop.shopName}</h4>
                      <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {shop.category}
                    </span>
                    <div className="text-xs text-slate-400 mt-1 flex items-center truncate">
                      <MapPin size={11} className="mr-1 shrink-0" />
                      <span className="truncate">{shop.area}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {shop.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <a
                      href={`tel:${shop.mobileNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                      title="कॉल करें"
                    >
                      <Phone size={14} />
                    </a>
                    <a
                      href={`https://wa.me/91${shop.whatsappNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl"
                      title="व्हाट्सएप"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>

                  <span className="font-bold text-amber-700 flex items-center space-x-1">
                    <span>दुकान का पेज खोलें</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
