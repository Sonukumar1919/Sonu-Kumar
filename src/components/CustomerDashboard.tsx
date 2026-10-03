import React, { useState } from 'react';
import { 
  User, 
  Store, 
  ShoppingBag, 
  Megaphone, 
  Bookmark, 
  Heart, 
  LogOut, 
  Phone, 
  MapPin, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Shop, Product, ShopPost } from '../types';
import { UserFeedbackModal } from './UserFeedbackModal';

interface CustomerDashboardProps {
  onSelectShop: (shop: Shop) => void;
  onOpenRegisterShop: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  onSelectShop,
  onOpenRegisterShop 
}) => {
  const { 
    currentUser, 
    shops, 
    products, 
    posts, 
    logout,
    toggleSaveShop,
    toggleSaveProduct,
    toggleSavePost,
    setActiveTab,
    themeMode,
    toggleThemeMode 
  } = useApp();

  const [activeTab, setActiveDashboardTab] = useState<'saved_shops' | 'saved_products' | 'saved_posts'>('saved_shops');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  if (!currentUser) return null;

  const savedShops = shops.filter(s => currentUser.savedShopIds?.includes(s.id));
  const savedProducts = products.filter(p => currentUser.savedProductIds?.includes(p.id));
  const savedPosts = posts.filter(p => currentUser.savedPostIds?.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Card Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-amber-500/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                {currentUser.name}
              </h1>
              <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-md">
                सत्यापित ग्राहक (Customer)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              मोबाइल: +91 {currentUser.phoneNumber} {currentUser.email && `• ${currentUser.email}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleThemeMode}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs"
            title={themeMode === 'dark' ? 'लाइट थीम चालू करें' : 'डार्क थीम चालू करें'}
          >
            {themeMode === 'dark' ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-indigo-600" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          {/* Feedback to Superadmin */}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
          >
            <MessageSquare size={14} className="text-amber-600 dark:text-amber-400" />
            <span>अपनी राय दें</span>
          </button>

          <button
            onClick={onOpenRegisterShop}
            className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            🏪 अपनी दुकान जोड़ें
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveDashboardTab('saved_shops')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'saved_shops'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Store size={16} />
          <span>सेव की गई दुकानें (Saved Shops - {savedShops.length})</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab('saved_products')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'saved_products'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart size={16} />
          <span>पसंदीदा प्रोडक्ट्स (Saved Products - {savedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveDashboardTab('saved_posts')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'saved_posts'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark size={16} />
          <span>सेव की गई पोस्ट्स ({savedPosts.length})</span>
        </button>
      </div>

      {/* Tab 1: Saved Shops */}
      {activeTab === 'saved_shops' && (
        <div>
          {savedShops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Store size={36} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">अभी कोई दुकान सेव नहीं की गई है</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                मार्केट में दुकानें देखते समय बुकमार्क (⭐) बटन दबाकर अपनी पसंदीदा दुकानों को यहाँ सेव करें।
              </p>
              <button
                onClick={() => setActiveTab('shops')}
                className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                दुकानें खोजें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {savedShops.map(shop => (
                <div 
                  key={shop.id}
                  onClick={() => onSelectShop(shop)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition p-4 flex flex-col justify-between cursor-pointer space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=200&q=80'} 
                      alt={shop.shopName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100" 
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{shop.shopName}</h4>
                      <p className="text-xs text-amber-700 font-medium">{shop.category}</p>
                      <p className="text-[11px] text-slate-400">{shop.area}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveShop(shop.id);
                      }}
                      className="text-rose-600 font-semibold hover:underline"
                    >
                      हटाएं
                    </button>
                    <span className="text-amber-700 font-bold flex items-center">
                      दुकान खोलें &gt;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Products */}
      {activeTab === 'saved_products' && (
        <div>
          {savedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <ShoppingBag size={36} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">अभी कोई प्रोडक्ट सेव नहीं किया गया है</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                प्रोडक्ट्स पर दिल (❤️) आइकन दबाकर अपने मनपसंद प्रोडक्ट्स को यहाँ सुरक्षित रखें।
              </p>
              <button
                onClick={() => setActiveTab('products')}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                प्रोडक्ट्स ब्राउज़ करें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {savedProducts.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between space-y-3">
                  <div className="flex space-x-3">
                    <img src={prod.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80'} alt={prod.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-xs text-slate-500">{prod.shopName}</p>
                      <div className="text-sm font-extrabold text-slate-900 mt-1">
                        ₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => toggleSaveProduct(prod.id)}
                      className="text-rose-600 font-semibold hover:underline"
                    >
                      हटाएं
                    </button>
                    <button
                      onClick={() => {
                        const sh = shops.find(s => s.id === prod.shopId);
                        if (sh) onSelectShop(sh);
                      }}
                      className="text-amber-700 font-bold"
                    >
                      दुकान देखें &gt;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Posts */}
      {activeTab === 'saved_posts' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Megaphone size={36} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">अभी कोई पोस्ट सेव नहीं की गई है</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                दुकानों के ऑफर्स और ताज़ा घोषणाओं को बुकमार्क करके बाद में देखने के लिए यहाँ रखें।
              </p>
              <button
                onClick={() => setActiveTab('posts')}
                className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                ताज़ा पोस्ट्स देखें
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">{post.shopName}</span>
                    <button onClick={() => toggleSavePost(post.id)} className="text-rose-600 font-semibold">हटाएं</button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{post.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
