import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  Bookmark, 
  ExternalLink, 
  ShieldCheck, 
  Store,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Shop } from '../types';

interface ShopsListProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  onOpenRegisterShop: () => void;
}

export const ShopsList: React.FC<ShopsListProps> = ({ 
  onSelectShop, 
  onOpenAuth,
  onOpenRegisterShop 
}) => {
  const { 
    shops, 
    selectedCategory, 
    selectedArea, 
    searchQuery, 
    isShopSaved, 
    toggleSaveShop,
    currentUser 
  } = useApp();

  // Filter only active shops for public view
  const activeShops = shops.filter(shop => {
    if (shop.status !== 'active') return false;

    // Category filter
    if (selectedCategory !== 'all' && shop.category !== selectedCategory) {
      return false;
    }

    // Area filter
    if (selectedArea !== 'सभी क्षेत्र (All Areas)' && !shop.area.includes(selectedArea.replace(/\s\(.*/, ''))) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = shop.shopName.toLowerCase().includes(q);
      const matchOwner = shop.ownerName.toLowerCase().includes(q);
      const matchCat = shop.category.toLowerCase().includes(q);
      const matchDesc = shop.description.toLowerCase().includes(q);
      const matchArea = shop.area.toLowerCase().includes(q);
      if (!matchName && !matchOwner && !matchCat && !matchDesc && !matchArea) {
        return false;
      }
    }

    return true;
  });

  const handleSave = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleSaveShop(shopId);
  };

  const handleCall = (e: React.MouseEvent, phone: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent, whatsapp: string, shopName: string) => {
    e.stopPropagation();
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`नमस्ते ${shopName}! मैंने आपकी दुकान RAWLA MANDI पोर्टल पर देखी है। मुझे कुछ जानकारी चाहिए।`);
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleMap = (e: React.MouseEvent, mapLink?: string, address?: string) => {
    e.stopPropagation();
    if (mapLink) {
      window.open(mapLink, '_blank');
    } else {
      window.open(`https://maps.google.com/?q=${encodeURIComponent('Rawla Mandi ' + (address || ''))}`, '_blank');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-amber-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              🏪 सभी दुकानें (Shops Directory)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            रावला मंडी की सत्यापित व पंजीकृत स्थानीय दुकानें ({activeShops.length} दुकानें उपलब्ध)
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={onOpenRegisterShop}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            + अपनी दुकान यहाँ जोड़ें
          </button>
        </div>
      </div>

      {/* No shops found notice */}
      {activeShops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 my-6 p-8">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">कोई दुकान नहीं मिली</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            आपके चुने हुए फ़िल्टर या खोज के लिए कोई सक्रिय दुकान नहीं मिली। कृपया फ़िल्टर बदलें या अपनी दुकान रजिस्टर करें।
          </p>
          <div className="mt-5 flex justify-center space-x-3">
            <button
              onClick={onOpenRegisterShop}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              दुकान रजिस्टर करें
            </button>
          </div>
        </div>
      ) : (
        /* Shops Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {activeShops.map((shop) => {
            const saved = isShopSaved(shop.id);
            return (
              <div
                key={shop.id}
                onClick={() => onSelectShop(shop)}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-amber-400"
              >
                {/* Shop Cover Image */}
                <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80'}
                    alt={shop.shopName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
                    {shop.category}
                  </span>

                  {/* Save Shop Button */}
                  <button
                    onClick={(e) => handleSave(e, shop.id)}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                      saved 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                    title={saved ? 'दुकान सेव है' : 'दुकान सेव करें'}
                  >
                    <Bookmark size={16} className={saved ? 'fill-white' : ''} />
                  </button>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-xl bg-white p-0.5 shadow-md overflow-hidden shrink-0 border border-white">
                        <img 
                          src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80'} 
                          alt="logo" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs text-amber-300 font-semibold flex items-center space-x-1">
                          <MapPin size={12} />
                          <span className="truncate">{shop.area}</span>
                        </div>
                      </div>
                    </div>

                    {shop.rating && (
                      <div className="flex items-center space-x-1 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-xs shrink-0">
                        <Star size={12} className="fill-white" />
                        <span>{shop.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-600 transition flex items-center space-x-1">
                        <span className="truncate">{shop.shopName}</span>
                        <span title="सत्यापित दुकान (Verified Shop)">
                          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                        </span>
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      संचालक: <span className="text-slate-700 font-semibold">{shop.ownerName}</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {shop.description}
                    </p>
                  </div>

                  {/* Timing & Address */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-600">
                        <Clock size={13} className="text-amber-600 mr-1.5" />
                        समय: {shop.openingTime} - {shop.closingTime}
                      </span>
                      <span className="inline-flex items-center text-emerald-600 font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                        खुली है (Open)
                      </span>
                    </div>

                    <div className="flex items-center text-slate-600 truncate">
                      <MapPin size={13} className="text-slate-400 mr-1.5 shrink-0" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                  </div>

                  {/* Action Contact Buttons */}
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <button
                      onClick={(e) => handleCall(e, shop.mobileNumber)}
                      className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="फ़ोन कॉल करें"
                    >
                      <Phone size={14} className="text-blue-600" />
                      <span>Call</span>
                    </button>

                    <button
                      onClick={(e) => handleWhatsApp(e, shop.whatsappNumber, shop.shopName)}
                      className="flex items-center justify-center space-x-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-2 rounded-xl text-xs font-bold transition border border-emerald-200 cursor-pointer"
                      title="व्हाट्सएप पर चैट करें"
                    >
                      <MessageCircle size={14} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={(e) => handleMap(e, shop.googleMapLocation, shop.address)}
                      className="flex items-center justify-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-900 py-2 rounded-xl text-xs font-bold transition border border-amber-200 cursor-pointer"
                      title="गूगल मैप्स पर लोकेशन देखें"
                    >
                      <MapPin size={14} className="text-amber-600" />
                      <span>Location</span>
                    </button>
                  </div>

                  {/* View Channel Button */}
                  <div className="pt-1">
                    <button 
                      onClick={() => onSelectShop(shop)}
                      className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <span>दुकान का पूरा पेज देखें (Shop Channel)</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
