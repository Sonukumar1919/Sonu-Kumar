import React, { useState } from 'react';
import { MapPin, Navigation, Store, ShieldCheck, Clock, Phone, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RAWLA_AREAS } from '../data/constants';
import { Shop } from '../types';

interface AreaLocationsViewProps {
  onSelectShop: (shop: Shop) => void;
}

export const AreaLocationsView: React.FC<AreaLocationsViewProps> = ({ onSelectShop }) => {
  const { shops, selectedArea, setSelectedArea } = useApp();

  const areasList = RAWLA_AREAS.filter(a => a !== 'सभी क्षेत्र (All Areas)');
  const [activeArea, setActiveArea] = useState<string>(
    selectedArea !== 'सभी क्षेत्र (All Areas)' ? selectedArea : areasList[0]
  );

  const cleanAreaName = activeArea.replace(/\s\(.*/, '');
  const areaShops = shops.filter(s => s.status === 'active' && s.area.includes(cleanAreaName));

  const handleOpenMap = (e: React.MouseEvent, shop: Shop) => {
    e.stopPropagation();
    if (shop.googleMapLocation) {
      window.open(shop.googleMapLocation, '_blank');
    } else {
      window.open(`https://maps.google.com/?q=${encodeURIComponent('Rawla Mandi ' + shop.shopName + ' ' + shop.address)}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Navigation size={13} className="text-amber-700" />
          <span>रावला मंडी क्षेत्र व दुकान लोकेशन</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          📍 क्षेत्र अनुसार दुकानें (Area & Location)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          रावला मंडी के अपने नजदीकी क्षेत्र को चुनें और वहां स्थित सभी सक्रिय दुकानों की सटीक लोकेशन देखें।
        </p>
      </div>

      {/* Area Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {areasList.map((area) => {
          const areaClean = area.replace(/\s\(.*/, '');
          const count = shops.filter(s => s.status === 'active' && s.area.includes(areaClean)).length;
          const isSelected = activeArea === area;

          return (
            <button
              key={area}
              onClick={() => {
                setActiveArea(area);
                setSelectedArea(area);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition flex items-center space-x-1.5 cursor-pointer border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <MapPin size={15} />
              <span>{area}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Area Card Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200">चयनित क्षेत्र</span>
          <h2 className="text-xl sm:text-2xl font-black">{activeArea}</h2>
          <p className="text-xs text-amber-100 mt-0.5">
            इस क्षेत्र में {areaShops.length} सत्यापित दुकानें मौजूद हैं।
          </p>
        </div>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent('Rawla Mandi ' + cleanAreaName)}`}
          target="_blank"
          rel="noreferrer"
          className="bg-white text-slate-900 hover:bg-amber-50 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-md flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Navigation size={15} className="text-amber-600" />
          <span>Google Maps पर पूरा क्षेत्र देखें</span>
        </a>
      </div>

      {/* Shops in this Area */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">
          {cleanAreaName} की सभी दुकानें
        </h3>

        {areaShops.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <Store size={36} className="text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">इस क्षेत्र में अभी कोई सक्रिय दुकान दर्ज नहीं है</p>
            <p className="text-xs text-slate-400">यदि आपकी दुकान इस क्षेत्र में है, तो अभी "अपनी दुकान जोड़ें" पर क्लिक करके रजिस्टर करें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaShops.map(shop => (
              <div
                key={shop.id}
                onClick={() => onSelectShop(shop)}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={shop.photoUrl}
                    alt={shop.shopName}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="truncate">
                    <div className="flex items-center space-x-1">
                      <h4 className="font-bold text-base text-slate-900 truncate">{shop.shopName}</h4>
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {shop.category}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1 text-slate-400 shrink-0" />
                      <span>{shop.openingTime} - {shop.closingTime} (खुली है)</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{shop.address}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleOpenMap(e, shop)}
                      className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                    >
                      <MapPin size={13} className="text-amber-700" />
                      <span>मैप लोकेशन</span>
                    </button>
                    <a
                      href={`tel:${shop.mobileNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs"
                      title="कॉल"
                    >
                      <Phone size={13} />
                    </a>
                    <a
                      href={`https://wa.me/91${shop.whatsappNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs"
                      title="व्हाट्सएप"
                    >
                      <MessageCircle size={13} />
                    </a>
                  </div>

                  <span className="font-bold text-xs text-amber-700 flex items-center space-x-1">
                    <span>दुकान देखें</span>
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
