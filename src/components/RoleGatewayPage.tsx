import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle, 
  X, 
  Compass, 
  Building2, 
  Palette,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopRegistrationModal } from './ShopRegistrationModal';

export const RoleGatewayPage: React.FC = () => {
  const { 
    enterAsCustomer, 
    loginShopkeeper, 
    loginAdmin, 
    shops,
    systemSettings 
  } = useApp();

  // Dynamic Theme State
  const [activeTheme, setActiveTheme] = useState<'golden' | 'indigo' | 'emerald' | 'neon'>('golden');

  // Sub-modals inside Gateway
  const [activeModal, setActiveModal] = useState<'none' | 'shopkeeper_login' | 'admin_login'>('none');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Shopkeeper Login State
  const [shopEmail, setShopEmail] = useState('');
  const [shopPassword, setShopPassword] = useState('');
  const [shopError, setShopError] = useState('');
  const [shopLoading, setShopLoading] = useState(false);
  const [showShopPass, setShowShopPass] = useState(false);

  // Admin Login State (Fixed email: sonukumar106163@gmail.com)
  const adminEmail = 'sonukumar106163@gmail.com';
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Auto theme rotation preview timer (subtle, non-intrusive)
  useEffect(() => {
    const themes: ('golden' | 'indigo' | 'emerald' | 'neon')[] = ['golden', 'indigo', 'emerald', 'neon'];
    const timer = setInterval(() => {
      setActiveTheme(prev => {
        const nextIdx = (themes.indexOf(prev) + 1) % themes.length;
        return themes[nextIdx];
      });
    }, 12000); // changes ambient theme every 12s
    return () => clearInterval(timer);
  }, []);

  const handleShopkeeperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShopError('');
    if (!shopEmail || !shopPassword) {
      setShopError('कृपया ईमेल और पासवर्ड दोनों दर्ज करें।');
      return;
    }
    setShopLoading(true);
    const res = await loginShopkeeper(shopEmail, shopPassword);
    setShopLoading(false);

    if (!res.success) {
      setShopError(res.message || 'लॉगिन विफल! कृपया ईमेल और पासवर्ड पुनः जांचें।');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (!adminPassword) {
      setAdminError('कृपया एडमिन पासवर्ड दर्ज करें।');
      return;
    }
    setAdminLoading(true);
    const res = await loginAdmin(adminEmail, adminPassword);
    setAdminLoading(false);

    if (!res.success) {
      setAdminError(res.message || 'अमान्य एडमिन क्रेडेंशियल!');
    }
  };

  // Theme Styling Map
  const themeStyles = {
    golden: {
      bgGradient: 'from-amber-950 via-slate-900 to-orange-950',
      heroBadgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentGlow: 'from-amber-500/30 via-orange-500/20 to-transparent',
      titleHighlight: 'from-amber-300 via-orange-400 to-amber-200',
      custCardBg: 'from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:to-orange-500',
      shopCardBg: 'from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600',
      adminBtnBg: 'bg-slate-800/90 hover:bg-slate-700 border-amber-500/30 text-amber-300'
    },
    indigo: {
      bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
      heroBadgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      accentGlow: 'from-indigo-500/30 via-purple-500/20 to-transparent',
      titleHighlight: 'from-indigo-300 via-sky-400 to-blue-200',
      custCardBg: 'from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500',
      shopCardBg: 'from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:to-pink-500',
      adminBtnBg: 'bg-slate-800/90 hover:bg-slate-700 border-indigo-500/30 text-indigo-300'
    },
    emerald: {
      bgGradient: 'from-slate-950 via-emerald-950 to-teal-950',
      heroBadgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentGlow: 'from-emerald-500/30 via-teal-500/20 to-transparent',
      titleHighlight: 'from-emerald-300 via-teal-300 to-emerald-100',
      custCardBg: 'from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500',
      shopCardBg: 'from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500',
      adminBtnBg: 'bg-slate-800/90 hover:bg-slate-700 border-emerald-500/30 text-emerald-300'
    },
    neon: {
      bgGradient: 'from-slate-950 via-purple-950 to-rose-950',
      heroBadgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      accentGlow: 'from-rose-500/30 via-purple-500/20 to-transparent',
      titleHighlight: 'from-pink-300 via-rose-400 to-purple-200',
      custCardBg: 'from-rose-600 via-purple-600 to-rose-700 hover:from-rose-500 hover:to-purple-500',
      shopCardBg: 'from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500',
      adminBtnBg: 'bg-slate-800/90 hover:bg-slate-700 border-rose-500/30 text-rose-300'
    }
  };

  const theme = themeStyles[activeTheme];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} text-white flex flex-col justify-between relative overflow-hidden transition-all duration-1000 select-none`}>
      
      {/* Background Animated Glowing Lights */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b ${theme.accentGlow} blur-3xl rounded-full pointer-events-none transition-all duration-1000`}></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* Floating Local Market Emojis Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden flex justify-around items-center text-4xl sm:text-6xl space-x-4">
        <span className="animate-bounce delay-100">🌾</span>
        <span className="animate-pulse delay-300">📱</span>
        <span className="animate-bounce delay-500">👗</span>
        <span className="animate-pulse delay-700">🛍️</span>
        <span className="animate-bounce delay-1000">🚜</span>
        <span className="animate-pulse delay-200">🏪</span>
      </div>

      {/* Top Header & Theme Switcher Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              R
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-display tracking-tight flex items-center space-x-1">
              <span>{systemSettings.siteName || 'RAWLA'}</span>
              <span className="text-amber-400">{systemSettings.siteNameHighlight || 'MANDI'}</span>
            </h1>
            <p className="text-[10px] text-slate-300 font-medium">रावला मंडी डिजिटल बाज़ार</p>
          </div>
        </div>

        {/* Theme Switcher Button */}
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-md">
          <Palette size={14} className="text-amber-400" />
          <span className="text-xs font-bold text-slate-300 hidden sm:inline">थीम बदलें:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTheme('golden')}
              title="गोल्डन मंडी"
              className={`w-5 h-5 rounded-full bg-amber-500 transition-transform ${activeTheme === 'golden' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
            />
            <button
              onClick={() => setActiveTheme('indigo')}
              title="रॉयल इंडिगो"
              className={`w-5 h-5 rounded-full bg-indigo-500 transition-transform ${activeTheme === 'indigo' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
            />
            <button
              onClick={() => setActiveTheme('emerald')}
              title="हरित बाज़ार"
              className={`w-5 h-5 rounded-full bg-emerald-500 transition-transform ${activeTheme === 'emerald' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
            />
            <button
              onClick={() => setActiveTheme('neon')}
              title="साइबर नियॉन"
              className={`w-5 h-5 rounded-full bg-rose-500 transition-transform ${activeTheme === 'neon' ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
            />
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center space-y-8 text-center">
        
        {/* Welcome Tagline */}
        <div className="space-y-3 max-w-2xl">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-bold ${theme.heroBadgeBg} backdrop-blur-md animate-pulse`}>
            <Sparkles size={14} />
            <span>अपनी भूमिका चुनें और प्रवेश करें</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
            रावला मंडी में आपका <br />
            <span className={`bg-gradient-to-r ${theme.titleHighlight} bg-clip-text text-transparent`}>
              डिजिटल स्वागत है!
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-lg mx-auto">
            कृपया नीचे दिए गए विकल्पों में से चुनें। ग्राहक बिना लॉगिन तुरंत खरीदारी व सामान देख सकते हैं। दुकानदारों व एडमिन के लिए लॉगिन आवश्यक है।
          </p>
        </div>

        {/* ----------------- THE 3 ROLE BUTTONS ----------------- */}
        <div className="w-full max-w-3xl space-y-5 pt-2">

          {/* 1. CUSTOMER (खरीदना) - BIG PROMINENT BUTTON */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <button
              onClick={enterAsCustomer}
              className={`relative w-full bg-gradient-to-r ${theme.custCardBg} text-white p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 transition transform hover:-translate-y-1 cursor-pointer border border-white/20`}
            >
              <div className="flex items-center space-x-5 text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition duration-300">
                  <ShoppingBag size={34} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      बिना किसी लॉगिन के
                    </span>
                    <span className="text-xs font-bold text-amber-200">1. customer (खरीदना)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                    1. ग्राहक (खरीदना)
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium max-w-md">
                    बिना पासवर्ड/लॉगिन पूरी मंडी घूमें, दुकानें खोजें, उत्पाद देखें, दुकानदार को सीधा कॉल या व्हाट्सएप करें।
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2 bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg group-hover:bg-amber-100 transition">
                <span>मंडी में प्रवेश करें</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>

          {/* 2. DUKANDAR (बेचना) - BIG PROMINENT BUTTON */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <button
              onClick={() => setActiveModal('shopkeeper_login')}
              className={`relative w-full bg-gradient-to-r ${theme.shopCardBg} text-white p-6 sm:p-7 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 transition transform hover:-translate-y-1 cursor-pointer border border-white/20`}
            >
              <div className="flex items-center space-x-5 text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition duration-300">
                  <Store size={34} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      ईमेल & पासवर्ड द्वारा
                    </span>
                    <span className="text-xs font-bold text-emerald-200">2. Dukandar (बेचना)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                    2. दुकानदार (बेचना)
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium max-w-md">
                    अपनी दुकान का Gmail & Password सेट करें, नई दुकान जोड़ें या लॉगिन करके प्रोडक्ट्स जोड़ें व दुकान को लाइव करें।
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2 bg-white text-emerald-950 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg group-hover:bg-emerald-50 transition">
                <span>दुकानदार लॉगिन / साइन-अप</span>
                <KeyRound size={18} />
              </div>
            </button>
          </div>

          {/* 3. ADMIN (सुपर एडमिन) - SMALL SLEEK BUTTON AT THE BOTTOM */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setActiveModal('admin_login')}
              className={`px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold shadow-lg transition flex items-center space-x-2 cursor-pointer ${theme.adminBtnBg}`}
            >
              <ShieldCheck size={16} className="text-amber-400" />
              <span>3. admin (सुपर एडमिन)</span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md font-mono text-slate-300">
                अधिकृत प्रवेश
              </span>
            </button>
          </div>

        </div>

      </main>

      {/* Footer Note */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>
          🌾 <strong>RAWLA MANDI</strong> — डिजिटल मंडी और स्थानीय बाज़ार पोर्टल
        </div>
        <div className="text-[11px] text-slate-400">
          सुरक्षित डिजिटल प्लेटफ़ॉर्म • सर्वाधिकार सुरक्षित
        </div>
      </footer>

      {/* ----------------- SHOPKEEPER LOGIN & REGISTER MODAL ----------------- */}
      {activeModal === 'shopkeeper_login' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">दुकानदार लॉगिन (Shopkeeper)</h3>
                  <p className="text-xs text-emerald-100">अपनी पंजीकृत दुकान में प्रवेश करें</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl hover:bg-white/20 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              <form onSubmit={handleShopkeeperLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    दुकान की Gmail / ईमेल (Shop Email) *
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={shopEmail}
                      onChange={(e) => setShopEmail(e.target.value)}
                      placeholder="sharma@rawlamandi.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    दुकान का पासवर्ड (Password) *
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400" />
                    <input
                      type={showShopPass ? 'text' : 'password'}
                      value={shopPassword}
                      onChange={(e) => setShopPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowShopPass(!showShopPass)}
                      className="absolute right-3.5 text-slate-400 hover:text-white"
                    >
                      {showShopPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {shopError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{shopError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={shopLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition cursor-pointer"
                >
                  {shopLoading ? 'लॉगिन हो रहा है...' : 'दुकान लॉगिन करें (Login Shop)'}
                </button>
              </form>

              {/* Option to Register New Shop */}
              <div className="pt-2 border-t border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">क्या आपकी दुकान पंजीकृत नहीं है?</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    setIsRegisterModalOpen(true);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-400 py-3 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Building2 size={16} />
                  <span>नई दुकान रजिस्टर करें (Register Free Shop)</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUPER ADMIN LOGIN MODAL ----------------- */}
      {activeModal === 'admin_login' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-amber-500/30 text-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">सुपर एडमिन लॉगिन (Super Admin)</h3>
                  <p className="text-xs text-amber-100">पोर्टल नियंत्रण एवं लाइव एडिट पॉवर</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 rounded-xl hover:bg-white/20 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    अधिकृत सुपर एडमिन Gmail (Locked)
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-amber-400" />
                    <input
                      type="email"
                      value={adminEmail}
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-amber-500/30 rounded-xl text-sm font-extrabold text-amber-300 cursor-not-allowed opacity-90"
                    />
                    <Lock size={14} className="absolute right-3.5 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-amber-300/80 mt-1">
                    केवल {adminEmail} ही सुपर एडमिन के रूप में लॉगिन कर सकते हैं।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    एडमिन पासवर्ड (Admin Password) *
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound size={16} className="absolute left-3.5 text-slate-400" />
                    <input
                      type={showAdminPass ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3.5 text-slate-400 hover:text-white"
                    >
                      {showAdminPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{adminError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition cursor-pointer"
                >
                  {adminLoading ? 'सत्यापित हो रहा है...' : '3. admin के रूप में प्रवेश करें (Super Admin Access)'}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* Embedded Shop Registration Modal */}
      <ShopRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={(shopId) => {
          setIsRegisterModalOpen(false);
        }}
      />

    </div>
  );
};
