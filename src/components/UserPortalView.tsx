import React, { useState } from 'react';
import { 
  User, 
  Store, 
  ShoppingBag, 
  Megaphone, 
  Bookmark, 
  Heart, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  LogOut, 
  KeyRound,
  RotateCcw,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Shop, Product, ShopPost } from '../types';
import { UserFeedbackModal } from './UserFeedbackModal';

interface UserPortalViewProps {
  onSelectShop: (shop: Shop) => void;
  onOpenRegisterShop: () => void;
  onOpenAuth: () => void;
}

export const UserPortalView: React.FC<UserPortalViewProps> = ({
  onSelectShop,
  onOpenRegisterShop,
  onOpenAuth
}) => {
  const { 
    currentUser, 
    role, 
    shops, 
    products, 
    posts, 
    logout, 
    loginAsDemoUser,
    toggleSaveProduct,
    toggleSaveShop,
    toggleSavePost,
    toggleProductStock,
    deleteProduct,
    deletePost,
    setActiveTab,
    themeMode,
    toggleThemeMode
  } = useApp();

  const [customerSubTab, setCustomerSubTab] = useState<'saved_products' | 'saved_shops' | 'saved_posts'>('saved_products');
  const [shopkeeperSubTab, setShopkeeperSubTab] = useState<'posts_status' | 'products' | 'shop_info'>('posts_status');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // If user is not logged in, show quick login or demo persona
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6 pb-24 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <User size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 font-display">यूज़र लॉगिन (User Login)</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            अपने सेव किए गए प्रोडक्ट्स देखने या दुकान का स्टेटस चेक करने के लिए लॉगिन करें।
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <button
            onClick={onOpenAuth}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-2xl text-sm font-bold shadow-md cursor-pointer"
          >
            मोबाइल नंबर + OTP से लॉगिन करें
          </button>
        </div>
      </div>
    );
  }

  // Find user's shop if shopkeeper
  const userShop = shops.find(s => s.id === currentUser.shopId || s.ownerUid === currentUser.uid) 
    || (role === 'shopkeeper' ? shops[0] : null);

  const shopProducts = userShop ? products.filter(p => p.shopId === userShop.id) : [];
  const userShopPosts = userShop ? posts.filter(p => p.shopId === userShop.id) : [];

  // Customer saved items
  const savedProducts = products.filter(p => currentUser.savedProductIds?.includes(p.id));
  const savedShops = shops.filter(s => currentUser.savedShopIds?.includes(s.id));
  const savedPosts = posts.filter(p => currentUser.savedPostIds?.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28">
      
      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">{currentUser.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : role === 'shopkeeper' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {role === 'admin' ? 'Super Admin' : role === 'shopkeeper' ? 'दुकानदार (Shopkeeper)' : 'ग्राहक (Customer)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              मोबाइल: +91 {currentUser.phoneNumber}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
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

          {/* Feedback to Creator / Superadmin */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 px-3 py-2 rounded-xl transition cursor-pointer shadow-2xs"
          >
            <MessageSquare size={14} className="text-amber-600 dark:text-amber-400" />
            <span>अपनी राय दें</span>
          </button>

          {role !== 'shopkeeper' && (
            <button
              onClick={onOpenRegisterShop}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              + अपनी दुकान जोड़ें
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              एडमिन डैशबोर्ड &gt;
            </button>
          )}

          <button
            onClick={logout}
            className="flex items-center space-x-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      {/* VIEW A: SHOPKEEPER VIEW (दुकानदार - दुकान व पोस्ट स्टेटस) */}
      {role === 'shopkeeper' && userShop && (
        <div className="space-y-6">
          
          {/* Shop Status Banner */}
          <div className={`p-4 rounded-3xl border flex items-center justify-between ${
            userShop.status === 'active'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : userShop.status === 'pending'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                userShop.status === 'active' ? 'bg-emerald-600' : userShop.status === 'pending' ? 'bg-amber-600' : 'bg-rose-600'
              }`}>
                <Store size={20} />
              </div>
              <div>
                <div className="font-extrabold text-sm sm:text-base">{userShop.shopName}</div>
                <div className="text-xs font-semibold flex items-center space-x-1.5 mt-0.5">
                  <span>दुकान अप्रूवल स्थिति:</span>
                  <span className="font-black underline">
                    {userShop.status === 'active' ? '🟢 Active (दुकान लाइव है)' : userShop.status === 'pending' ? '⏳ Pending Approval (प्रतीक्षारत)' : '🔴 Blocked (ब्लॉक)'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectShop(userShop)}
              className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
            >
              लाइव दुकान देखें &gt;
            </button>
          </div>

          {/* Shopkeeper Sub-Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setShopkeeperSubTab('posts_status')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                shopkeeperSubTab === 'posts_status' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Megaphone size={15} />
              <span>मेरी पोस्ट्स व स्टेटस ({userShopPosts.length})</span>
            </button>

            <button
              onClick={() => setShopkeeperSubTab('products')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                shopkeeperSubTab === 'products' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag size={15} />
              <span>मेरे प्रोडक्ट्स ({shopProducts.length})</span>
            </button>
          </div>

          {/* Tab 1: Shopkeeper Posts Status */}
          {shopkeeperSubTab === 'posts_status' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">दुकान द्वारा डाली गई पोस्ट्स की स्थिति</h3>
                <button
                  onClick={() => setActiveTab('shop_dashboard')}
                  className="bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
                >
                  + नई पोस्ट बनाएं
                </button>
              </div>

              {userShopPosts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                  <Megaphone size={32} className="text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">अभी कोई पोस्ट नहीं डाली गई है</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userShopPosts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {post.status === 'active' ? '🟢 लाइव (Live on Website)' : 'प्रतीक्षारत'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.description}</p>
                        <div className="text-[11px] text-rose-600 font-semibold mt-1">❤️ {post.likesCount || 0} ग्राहकों ने पसंद किया</div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => {
                            if (confirm('पोस्ट हटाएं?')) deletePost(post.id);
                          }}
                          className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200"
                        >
                          हटाएं
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Shopkeeper Products */}
          {shopkeeperSubTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base">दुकान के प्रोडक्ट्स</h3>
                <button
                  onClick={() => setActiveTab('shop_dashboard')}
                  className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
                >
                  + नया सामान जोड़ें
                </button>
              </div>

              <div className="space-y-3">
                {shopProducts.map(prod => (
                  <div key={prod.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={prod.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{prod.name}</div>
                        <div className="text-xs text-slate-500">₹{(prod.discountPrice || prod.price).toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        prod.stockStatus === 'in_stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {prod.stockStatus === 'in_stock' ? 'स्टॉक उपलब्ध ✓' : 'स्टॉक समाप्त'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* VIEW B: CUSTOMER VIEW (ग्राहक - खुद के सेव किए गए प्रोडक्ट्स) */}
      {role === 'customer' && (
        <div className="space-y-6">
          
          {/* Customer Sub-Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setCustomerSubTab('saved_products')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                customerSubTab === 'saved_products' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart size={16} />
              <span>मेरे सेव किए गए प्रोडक्ट्स ({savedProducts.length})</span>
            </button>

            <button
              onClick={() => setCustomerSubTab('saved_shops')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                customerSubTab === 'saved_shops' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store size={16} />
              <span>सेव की गई दुकानें ({savedShops.length})</span>
            </button>

            <button
              onClick={() => setCustomerSubTab('saved_posts')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                customerSubTab === 'saved_posts' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark size={16} />
              <span>सेव पोस्ट्स ({savedPosts.length})</span>
            </button>
          </div>

          {/* Customer Saved Products */}
          {customerSubTab === 'saved_products' && (
            <div>
              {savedProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                  <ShoppingBag size={36} className="text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">अभी कोई प्रोडक्ट सेव नहीं किया गया है</p>
                  <p className="text-xs text-slate-400">होमपेज पर किसी भी प्रोडक्ट पर दिल (❤️) का आइकन दबाकर सेव करें।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {savedProducts.map(prod => (
                    <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                      <div className="flex space-x-3">
                        <img src={prod.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80'} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="truncate">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{prod.name}</h4>
                          <p className="text-xs text-slate-400">{prod.shopName}</p>
                          <div className="font-black text-slate-900 text-base mt-1">
                            ₹{(prod.discountPrice || prod.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <button
                          onClick={() => toggleSaveProduct(prod.id)}
                          className="text-rose-600 font-semibold"
                        >
                          हटाएं
                        </button>
                        <button
                          onClick={() => {
                            const sh = shops.find(s => s.id === prod.shopId);
                            if (sh) onSelectShop(sh);
                          }}
                          className="font-bold text-amber-700"
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

          {/* Customer Saved Shops */}
          {customerSubTab === 'saved_shops' && (
            <div>
              {savedShops.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                  <Store size={36} className="text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm">कोई दुकान सेव नहीं है</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedShops.map(shop => (
                    <div
                      key={shop.id}
                      onClick={() => onSelectShop(shop)}
                      className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <img src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=200&q=80'} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{shop.shopName}</h4>
                          <p className="text-xs text-slate-500">{shop.area}</p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-700 font-bold">खोलें &gt;</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer Saved Posts */}
          {customerSubTab === 'saved_posts' && (
            <div className="space-y-3">
              {savedPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
                  <Bookmark size={36} className="text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 text-sm mt-2">कोई पोस्ट सेव नहीं है</p>
                </div>
              ) : (
                savedPosts.map(post => (
                  <div key={post.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{post.shopName}</span>
                      <button onClick={() => toggleSavePost(post.id)} className="text-rose-600">हटाएं</button>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800">{post.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      )}

      {/* User Feedback to Superadmin Modal */}
      <UserFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        defaultRole={role === 'shopkeeper' ? 'shopkeeper' : 'customer'}
      />

    </div>
  );
};
