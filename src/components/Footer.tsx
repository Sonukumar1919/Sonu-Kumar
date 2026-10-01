import React from 'react';
import { Store, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SHOP_CATEGORIES } from '../data/constants';

interface FooterProps {
  onOpenRegisterShop: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegisterShop, onOpenAuth }) => {
  const { setActiveTab, setSelectedCategory, setSelectedShop } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
                <Store size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight font-display">
                RAWLA <span className="text-amber-500">MANDI</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed">
              रावला मंडी (श्रीगंगानगर, राजस्थान) का आधिकारिक डिजिटल बाज़ार। स्थानीय दुकानों की पहचान, ऑनलाइन कैटलॉग व सीधे व्हाट्सएप/कॉल संपर्क की संपूर्ण सुविधा।
            </p>

            <div className="text-[11px] text-amber-400/90 font-medium">
              🌾 'लोकल के लिए वोकल' — स्थानीय व्यापारियों का डिजिटल सशक्तिकरण
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">त्वरित लिंक</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => { setSelectedShop(null); setActiveTab('home'); }} 
                  className="hover:text-amber-400 transition"
                >
                  मुख्य पृष्ठ (Home)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedShop(null); setActiveTab('shops'); }} 
                  className="hover:text-amber-400 transition"
                >
                  सभी दुकानें (Shops Directory)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedShop(null); setActiveTab('products'); }} 
                  className="hover:text-amber-400 transition"
                >
                  प्रोडक्ट्स कैटलॉग (Products)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setSelectedShop(null); setActiveTab('posts'); }} 
                  className="hover:text-amber-400 transition"
                >
                  दैनिक ऑफर्स व पोस्ट्स (Offers & Posts)
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenRegisterShop} 
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition"
                >
                  + अपनी दुकान जोड़ें (Shop Registration)
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">प्रमुख श्रेणियां</h4>
            <ul className="space-y-2">
              {SHOP_CATEGORIES.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedShop(null);
                      setSelectedCategory(cat.label);
                      setActiveTab('shops');
                    }}
                    className="hover:text-amber-400 transition"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Rawla Mandi Emergency & Helpline */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs flex items-center text-amber-400">
              <Phone size={13} className="mr-1.5" />
              रावला मंडी हेल्पलाइन
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div>🏥 राजकीय अस्पताल (CHC Rawla): <span className="font-mono text-white">01507-280xxx</span></div>
              <div>👮 पुलिस थाना (Police Station): <span className="font-mono text-white">112 / 100</span></div>
              <div>🌾 कृषि उपज मंडी समिति: <span className="font-mono text-white">Main Mandi Yard</span></div>
              <div>🚒 आपातकालीन सहायता: <span className="font-mono text-white">108</span></div>
            </div>
            <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800">
              पिन कोड: <strong className="text-white">335707</strong> • तहसील: घड़साना / अनूपगढ़
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-slate-900 bg-black/40 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © {new Date().getFullYear()} RAWLA MANDI. सर्वाधिकार सुरक्षित। स्थानीय व्यापार को डिजिटल गति।
          </div>
          <div className="flex items-center space-x-1">
            <span>विकसित भारत • डिजिटल राजस्थान</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
