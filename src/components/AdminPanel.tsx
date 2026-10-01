import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Users, 
  Package, 
  Megaphone, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  Ban, 
  Unlock, 
  Settings as SettingsIcon, 
  FolderTree, 
  Flag, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Search, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Shop, ShopStatus } from '../types';
import { SHOP_CATEGORIES, RAWLA_AREAS } from '../data/constants';

interface AdminPanelProps {
  onSelectShop: (shop: Shop) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSelectShop }) => {
  const { 
    shops, 
    products, 
    posts, 
    approveShop, 
    rejectShop, 
    blockShop, 
    unblockShop, 
    deleteShop,
    deleteProduct,
    deletePost,
    togglePostStatus,
    systemSettings,
    updateSystemSettings 
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<
    'dashboard' | 'shop_requests' | 'active_shops' | 'blocked_shops' | 'users' | 'products' | 'posts' | 'categories' | 'reports' | 'settings'
  >('dashboard');

  const [selectedShopModal, setSelectedShopModal] = useState<Shop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const totalShops = shops.length;
  const activeShops = shops.filter(s => s.status === 'active');
  const pendingShops = shops.filter(s => s.status === 'pending');
  const blockedShops = shops.filter(s => s.status === 'blocked');
  const totalProducts = products.length;
  const totalPosts = posts.length;
  const totalUsers = 5420 + shops.length; // Baseline town users + registered

  const handleApprove = async (shopId: string) => {
    await approveShop(shopId);
    confetti({ particleCount: 70, spread: 70 });
    if (selectedShopModal?.id === shopId) setSelectedShopModal(null);
  };

  const handleReject = async (shopId: string) => {
    if (confirm('क्या आप इस दुकान पंजीकरण को अस्वीकार (Reject) करना चाहते हैं?')) {
      await rejectShop(shopId);
      if (selectedShopModal?.id === shopId) setSelectedShopModal(null);
    }
  };

  const handleBlock = async (shopId: string) => {
    if (confirm('क्या आप इस दुकान को ब्लॉक (Block) करना चाहते हैं? इससे इसकी सभी पोस्ट्स और प्रोडक्ट्स पोर्टल से तुरंत छिप जाएँगे।')) {
      await blockShop(shopId);
    }
  };

  const handleUnblock = async (shopId: string) => {
    await unblockShop(shopId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Title Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <ShieldCheck size={32} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">
                RAWLA MANDI ADMIN
              </h1>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                Super Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              रावला मंडी डिजिटल बाज़ार — संपूर्ण प्रशासनिक नियंत्रण (Super Admin Dashboard)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {pendingShops.length > 0 && (
            <button
              onClick={() => setActiveMenu('shop_requests')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer animate-pulse"
            >
              <span>🔔 {pendingShops.length} नई दुकान रिक्वेस्ट</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Layout: Sidebar Menu + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Admin Menu Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-1.5 self-start">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Admin Menu (प्रशासनिक मेनू)
          </div>

          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'dashboard' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Layers size={16} className="mr-2" /> Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveMenu('shop_requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'shop_requests' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Clock size={16} className="mr-2 text-amber-600" /> Shop Requests</span>
            {pendingShops.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeMenu === 'shop_requests' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-900'
              }`}>
                {pendingShops.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveMenu('active_shops')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'active_shops' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Store size={16} className="mr-2 text-emerald-600" /> Active Shops</span>
            <span className="text-xs text-slate-400">{activeShops.length}</span>
          </button>

          <button
            onClick={() => setActiveMenu('blocked_shops')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'blocked_shops' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Ban size={16} className="mr-2 text-rose-600" /> Blocked Shops</span>
            <span className="text-xs text-slate-400">{blockedShops.length}</span>
          </button>

          <button
            onClick={() => setActiveMenu('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'products' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Package size={16} className="mr-2" /> Products ({totalProducts})</span>
          </button>

          <button
            onClick={() => setActiveMenu('posts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'posts' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Megaphone size={16} className="mr-2" /> Posts Control ({totalPosts})</span>
          </button>

          <button
            onClick={() => setActiveMenu('users')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'users' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Users size={16} className="mr-2" /> Users (उपयोगकर्ता)</span>
          </button>

          <button
            onClick={() => setActiveMenu('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'categories' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><FolderTree size={16} className="mr-2" /> Categories ({SHOP_CATEGORIES.length})</span>
          </button>

          <button
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'reports' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><Flag size={16} className="mr-2 text-rose-500" /> Reports</span>
            <span className="text-xs text-slate-400">0</span>
          </button>

          <button
            onClick={() => setActiveMenu('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeMenu === 'settings' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center"><SettingsIcon size={16} className="mr-2" /> Settings (सेटिंग्स)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* View: Dashboard Stats Overview */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Counter Grid matching User Specification */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Total Users</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalUsers.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">सक्रिय ग्राहक व व्यापारी</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-slate-500 uppercase">Total Shops</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalShops}</div>
                  <div className="text-[11px] text-slate-500 font-medium">कुल पंजीकृत दुकानें</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-700 uppercase">Active Shops</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">{activeShops.length}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">लाइव व स्वीकृत दुकानें 🟢</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-amber-700 uppercase">Pending Shops</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">{pendingShops.length}</div>
                  <div className="text-[11px] text-amber-600 font-medium">स्वीकृति हेतु प्रतीक्षारत ⏳</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-rose-700 uppercase">Blocked Shops</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1">{blockedShops.length}</div>
                  <div className="text-[11px] text-rose-600 font-medium">प्रतिबंधित दुकानें 🔴</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs font-bold text-blue-700 uppercase">Products & Posts</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-800 mt-1">{totalProducts + totalPosts}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{totalProducts} सामान • {totalPosts} पोस्ट्स</div>
                </div>
              </div>

              {/* Pending Requests Alert if any */}
              {pendingShops.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                    <h3 className="font-bold text-amber-950 flex items-center">
                      <Clock size={18} className="mr-2 text-amber-600" />
                      नई दुकान पंजीकरण अनुरोध (Pending Approvals)
                    </h3>
                    <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                      {pendingShops.length} लंबित
                    </span>
                  </div>

                  <div className="divide-y divide-amber-200/60 mt-3">
                    {pendingShops.map(shop => (
                      <div key={shop.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{shop.shopName}</div>
                          <div className="text-xs text-slate-600">
                            संचालक: <strong>{shop.ownerName}</strong> • मोबाइल: +91 {shop.mobileNumber} • {shop.area}
                          </div>
                          <div className="text-xs text-amber-800 mt-0.5">श्रेणी: {shop.category}</div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedShopModal(shop)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            [View Details]
                          </button>
                          <button
                            onClick={() => handleApprove(shop.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            [Approve 🟢]
                          </button>
                          <button
                            onClick={() => handleReject(shop.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            [Reject]
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Quick Actions Guide */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <h3 className="font-bold text-slate-900 text-base">रावला मंडी एडमिन सुरक्षा व प्रबंधन नियम</h3>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
                  <li><strong>दुकान अप्रूवल:</strong> जब कोई दुकानदार अपनी दुकान जोड़ता है, तो वह ⏳ Pending स्थिति में रहती है। आपके Approve करने पर ही Active 🟢 होकर लाइव होगी।</li>
                  <li><strong>दुकान ब्लॉक सिस्टम:</strong> अगर कोई दुकानदार गलत जानकारी या गलत प्रोडक्ट्स डालता है, तो आप उसे <strong>Block 🔴</strong> कर सकते हैं। ब्लॉक होते ही दुकान और उसके सभी प्रोडक्ट्स वेबसाइट से गायब हो जाएँगे।</li>
                  <li><strong>पोस्ट नियंत्रण:</strong> एडमिन सेटिंग्स से पोस्ट अप्रूवल को चालू (ON) या सीधे लाइव (OFF) रख सकते हैं।</li>
                </ul>
              </div>

            </div>
          )}

          {/* View: Shop Requests */}
          {activeMenu === 'shop_requests' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">दुकान स्वीकृति अनुरोध (New Shop Requests)</h3>
                <p className="text-xs text-slate-500">यहाँ नए दुकानदारों के पंजीकरण अनुरोध आते हैं।</p>
              </div>

              {pendingShops.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  वर्तमान में कोई लंबित दुकान अनुरोध नहीं है। सभी दुकानें सत्यापित हैं।
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingShops.map(shop => (
                    <div key={shop.id} className="border border-amber-200 rounded-2xl p-4 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <img src={shop.photoUrl} alt={shop.shopName} className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{shop.shopName}</h4>
                          <div className="text-xs text-slate-600 mt-0.5">संचालक: {shop.ownerName} • मोबाइल: +91 {shop.mobileNumber}</div>
                          <div className="text-xs text-slate-500">पता: {shop.address} ({shop.area})</div>
                          <div className="text-xs text-amber-800 font-semibold mt-1">श्रेणी: {shop.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedShopModal(shop)}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          विवरण देखें
                        </button>
                        <button
                          onClick={() => handleApprove(shop.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md"
                        >
                          Approve 🟢 (स्वीकृत करें)
                        </button>
                        <button
                          onClick={() => handleReject(shop.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View: Active Shops */}
          {activeMenu === 'active_shops' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">सक्रिय दुकानें (Active Shops - {activeShops.length})</h3>
                  <p className="text-xs text-slate-500">ये सभी दुकानें वर्तमान में RAWLA MANDI पोर्टल पर लाइव दिखाई दे रही हैं।</p>
                </div>
              </div>

              <div className="space-y-3">
                {activeShops.map(shop => (
                  <div key={shop.id} className="border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 transition">
                    <div className="flex items-center space-x-3">
                      <img src={shop.logoUrl || shop.photoUrl} alt={shop.shopName} className="w-14 h-14 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900">{shop.shopName}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            🟢 Live
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">संचालक: {shop.ownerName} • +91 {shop.mobileNumber}</div>
                        <div className="text-xs text-slate-400">{shop.address} • {shop.area}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectShop(shop)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      >
                        पेज देखें
                      </button>
                      <button
                        onClick={() => handleBlock(shop.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                        title="दुकान ब्लॉक करें"
                      >
                        🚫 Block
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('क्या आप इस दुकान को हमेशा के लिए हटाना चाहते हैं?')) deleteShop(shop.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="डिलीट करें"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: Blocked Shops */}
          {activeMenu === 'blocked_shops' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">ब्लॉक की गई दुकानें (Blocked Shops - {blockedShops.length})</h3>
                <p className="text-xs text-slate-500">ये दुकानें और इनके प्रोडक्ट्स पोर्टल पर किसी भी ग्राहक को नहीं दिखेंगे।</p>
              </div>

              {blockedShops.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  कोई दुकान ब्लॉक नहीं की गई है।
                </div>
              ) : (
                <div className="space-y-3">
                  {blockedShops.map(shop => (
                    <div key={shop.id} className="border border-rose-200 bg-rose-50/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900">{shop.shopName}</h4>
                          <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            🔴 BLOCKED
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">संचालक: {shop.ownerName} • {shop.mobileNumber}</div>
                        <div className="text-xs text-slate-500">{shop.address}</div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUnblock(shop.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                        >
                          🟢 Unblock (पुनः सक्रिय करें)
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('दुकान को हमेशा के लिए हटाएं?')) deleteShop(shop.id);
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View: Products Control */}
          {activeMenu === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">सभी प्रोडक्ट्स प्रबंधन (Products - {products.length})</h3>
                <p className="text-xs text-slate-500">सभी दुकानों द्वारा लिस्ट किए गए उत्पाद। आप अनुचित सामान हटा सकते हैं।</p>
              </div>

              <div className="space-y-2">
                {products.map(prod => (
                  <div key={prod.id} className="p-3 border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <img src={prod.photoUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-slate-500">{prod.shopName} • ₹{(prod.discountPrice || prod.price).toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('प्रोडक्ट हटाएं?')) deleteProduct(prod.id);
                      }}
                      className="text-rose-600 font-semibold hover:bg-rose-50 p-2 rounded-lg"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: Posts Control */}
          {activeMenu === 'posts' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">दुकान पोस्ट्स नियंत्रण (Posts Control - {posts.length})</h3>
                <p className="text-xs text-slate-500">दुकानदारों द्वारा डाली गई पोस्ट्स को देखें, छिपाएं (Hide) या डिलीट करें।</p>
              </div>

              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{post.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {post.status === 'active' ? '🟢 Public' : 'Hidden'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-700 font-medium">Posted by {post.shopName}</div>
                      <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => togglePostStatus(post.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      >
                        {post.status === 'active' ? 'Hide (छिपाएं)' : 'Unhide'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('पोस्ट डिलीट करें?')) deletePost(post.id);
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View: Settings */}
          {activeMenu === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">प्लेटफ़ॉर्म सेटिंग्स (Platform Settings)</h3>
                <p className="text-xs text-slate-500">रावला मंडी पोर्टल की वैश्विक व्यवस्थाएं</p>
              </div>

              {/* Post Approval Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Post Approval (पोस्ट पूर्व-स्वीकृति)</div>
                  <div className="text-xs text-slate-500">
                    {systemSettings.postApprovalRequired 
                      ? 'चालू (ON): दुकानदार की पोस्ट पहले एडमिन अप्रूवल में जाएगी।' 
                      : 'बंद (OFF): दुकानदार पोस्ट डालते ही तुरंत लाइव हो जाएगी।'}
                  </div>
                </div>
                <button
                  onClick={() => updateSystemSettings({ postApprovalRequired: !systemSettings.postApprovalRequired })}
                  className="text-amber-600 cursor-pointer p-1"
                >
                  {systemSettings.postApprovalRequired ? <ToggleRight size={36} /> : <ToggleLeft size={36} className="text-slate-400" />}
                </button>
              </div>

              {/* Notice Banner */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  होमपेज मंडी सूचना पट्टी (Announcement Banner)
                </label>
                <input
                  type="text"
                  value={systemSettings.bannerNotice}
                  onChange={(e) => updateSystemSettings({ bannerNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold">भविष्य में कमाई (Monetization Plans)</div>
                <div>• फ़्री प्लान: बुनियादी प्रोफाइल, सीमित प्रोडक्ट्स</div>
                <div>• प्रीमियम प्लान: अनलिमिटेड प्रोडक्ट्स, फीचर्ड शॉप बैनर, टॉप रैंकिंग</div>
              </div>
            </div>
          )}

          {/* View: Categories & Areas */}
          {activeMenu === 'categories' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">दुकान श्रेणियां ({SHOP_CATEGORIES.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SHOP_CATEGORIES.map(cat => (
                  <div key={cat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>{cat.label}</span>
                    <span className="text-amber-600 font-mono">
                      {shops.filter(s => s.category === cat.label).length} दुकानें
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Shop Detail Modal */}
      {selectedShopModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">दुकान का संपूर्ण विवरण</h3>
              <button onClick={() => setSelectedShopModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <img src={selectedShopModal.photoUrl} alt="" className="w-full h-44 object-cover rounded-2xl" />
              <div>
                <strong className="text-sm text-slate-900">{selectedShopModal.shopName}</strong>
                <div className="text-amber-700 font-semibold">{selectedShopModal.category}</div>
              </div>
              <div><strong>संचालक:</strong> {selectedShopModal.ownerName}</div>
              <div><strong>मोबाइल:</strong> +91 {selectedShopModal.mobileNumber}</div>
              <div><strong>व्हाट्सएप:</strong> +91 {selectedShopModal.whatsappNumber}</div>
              <div><strong>पता:</strong> {selectedShopModal.address} ({selectedShopModal.area})</div>
              <div><strong>समय:</strong> {selectedShopModal.openingTime} - {selectedShopModal.closingTime}</div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <strong>विवरण:</strong> {selectedShopModal.description}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedShopModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                बंद करें
              </button>
              <button
                onClick={() => handleReject(selectedShopModal.id)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Reject (अस्वीकार)
              </button>
              <button
                onClick={() => handleApprove(selectedShopModal.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
              >
                Approve 🟢 (स्वीकृत करें)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
