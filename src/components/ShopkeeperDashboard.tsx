import React, { useState, useRef } from 'react';
import { 
  Store, 
  PlusCircle, 
  Package, 
  Megaphone, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Tag, 
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  Save,
  X,
  Sparkles,
  RefreshCw,
  Key
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Shop, Product, ShopPost } from '../types';
import { SHOP_CATEGORIES } from '../data/constants';
import { ImageUploadField } from './ImageUploadField';
import { compressAndReadImageFile } from '../utils/imageUtils';

interface ShopkeeperDashboardProps {
  onSelectShop: (shop: Shop) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({ onSelectShop }) => {
  const { 
    currentUser, 
    shops, 
    products, 
    posts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductStock,
    createPost, 
    updatePost, 
    deletePost,
    updateShop 
  } = useApp();

  // Find shop of current user
  const userShop = shops.find(s => s.id === currentUser?.shopId || s.ownerUid === currentUser?.uid) 
    || shops.find(s => s.id === 'shop-sharma-mobile') // Fallback to Sharma Mobile for demo
    || shops[0];

  const shopProducts = products.filter(p => p.shopId === userShop.id);
  const shopPosts = posts.filter(p => p.shopId === userShop.id);

  // Modals & form state
  const [activeTab, setActiveTab] = useState<'products' | 'posts' | 'settings'>('products');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Product form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(userShop.category);
  const [prodCondition, setProdCondition] = useState<'new' | 'used' | 'rent'>('new');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPhoto, setProdPhoto] = useState('https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80');
  const [prodGallery, setProdGallery] = useState<string[]>([]);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadImageFile(file, 800, 800, 0.75);
      if (dataUrl) {
        setProdGallery(prev => [...prev, dataUrl].slice(0, 4));
      }
    } catch (err) {
      alert('फोटो लोड करने में समस्या आई।');
    }
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
  };
  const [prodStock, setProdStock] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [prodCode, setProdCode] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Post form state
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postPhoto, setPostPhoto] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
  const [postOffer, setPostOffer] = useState('');
  const [postCategory, setPostCategory] = useState(userShop.category);
  const [postVideoUrl, setPostVideoUrl] = useState('');

  // Shop Edit state
  const [shopName, setShopName] = useState(userShop.shopName);
  const [shopPhoto, setShopPhoto] = useState(userShop.photoUrl);
  const [shopLogo, setShopLogo] = useState(userShop.logoUrl || userShop.photoUrl);
  const [shopDesc, setShopDesc] = useState(userShop.description);
  const [shopMobile, setShopMobile] = useState(userShop.mobileNumber);
  const [shopWhatsapp, setShopWhatsapp] = useState(userShop.whatsappNumber);
  const [shopAddress, setShopAddress] = useState(userShop.address);
  const [shopOpenTime, setShopOpenTime] = useState(userShop.openingTime);
  const [shopCloseTime, setShopCloseTime] = useState(userShop.closingTime);
  const [shopSavedNotice, setShopSavedNotice] = useState(false);

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const finalGallery = [prodPhoto, ...prodGallery.filter(u => u && u !== prodPhoto)].slice(0, 5);

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        condition: prodCondition,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        description: prodDesc,
        photoUrl: prodPhoto,
        galleryUrls: finalGallery,
        stockStatus: prodStock,
        productCode: prodCode
      });
      setEditingProductId(null);
    } else {
      await addProduct({
        shopId: userShop.id,
        shopName: userShop.shopName,
        ownerUid: userShop.ownerUid,
        name: prodName,
        category: prodCategory,
        condition: prodCondition,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        description: prodDesc,
        photoUrl: prodPhoto,
        galleryUrls: finalGallery,
        stockStatus: prodStock,
        productCode: prodCode
      });
      confetti({ particleCount: 50, spread: 60 });
    }

    // Reset
    setProdName('');
    setProdPrice('');
    setProdDiscountPrice('');
    setProdDesc('');
    setProdCode('');
    setProdGallery([]);
    setProdCondition('new');
    setIsAddProductOpen(false);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdCondition(prod.condition || 'new');
    setProdPrice(prod.price.toString());
    setProdDiscountPrice(prod.discountPrice ? prod.discountPrice.toString() : '');
    setProdDesc(prod.description);
    setProdPhoto(prod.photoUrl);
    setProdGallery(prod.galleryUrls ? prod.galleryUrls.filter(u => u !== prod.photoUrl) : []);
    setProdStock(prod.stockStatus);
    setProdCode(prod.productCode || '');
    setIsAddProductOpen(true);
  };

  // Create post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postDesc) return;

    await createPost({
      shopId: userShop.id,
      shopName: userShop.shopName,
      shopLogo: userShop.logoUrl,
      shopArea: userShop.area,
      shopCategory: userShop.category,
      ownerUid: userShop.ownerUid,
      title: postTitle,
      description: postDesc,
      photoUrl: postPhoto || undefined,
      videoUrl: postVideoUrl || undefined,
      offer: postOffer || undefined,
      category: postCategory,
      status: 'active'
    });

    confetti({ particleCount: 50, spread: 60 });
    setPostTitle('');
    setPostDesc('');
    setPostOffer('');
    setPostVideoUrl('');
    setIsCreatePostOpen(false);
  };

  // Update shop profile
  const handleSaveShopSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateShop(userShop.id, {
      shopName,
      photoUrl: shopPhoto,
      logoUrl: shopLogo,
      description: shopDesc,
      mobileNumber: shopMobile,
      whatsappNumber: shopWhatsapp,
      address: shopAddress,
      openingTime: shopOpenTime,
      closingTime: shopCloseTime
    });
    setShopSavedNotice(true);
    setTimeout(() => setShopSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Shop Banner & Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            <img src={userShop.logoUrl || userShop.photoUrl} alt={userShop.shopName} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {userShop.shopName}
              </h1>
              
              {/* Status Badge */}
              {userShop.status === 'active' && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active 🟢 (लाइव)
                </span>
              )}
              {userShop.status === 'pending' && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                  <Clock size={12} className="mr-1" />
                  Pending ⏳ (Admin अप्रूवल प्रतीक्षित)
                </span>
              )}
              {userShop.status === 'blocked' && (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Blocked 🔴 (सार्वजनिक रूप से छिपी हुई)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              संचालक: <strong className="text-slate-700">{userShop.ownerName}</strong> • {userShop.area} • श्रेणी: {userShop.category}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => onSelectShop(userShop)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
          >
            <Eye size={16} />
            <span>दुकान का लाइव पेज देखें</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>कुल प्रोडक्ट्स</span>
            <Package size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{shopProducts.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">लाइव कैटलॉग</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>कुल पोस्ट्स / ऑफर्स</span>
            <Megaphone size={16} className="text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{shopPosts.length}</div>
          <div className="text-[11px] text-orange-600 font-medium">दैनिक घोषणाएं</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>दुकान फॉलोवर्स</span>
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{userShop.followersCount || 148}</div>
          <div className="text-[11px] text-blue-600 font-medium">ग्राहक जुड़े हुए हैं</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>रेटिंग</span>
            <ShieldCheck size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{userShop.rating || 4.8} ★</div>
          <div className="text-[11px] text-amber-600 font-medium">विश्वसनीय विक्रेता</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'products' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package size={16} />
            <span>प्रोडक्ट्स प्रबंधन ({shopProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'posts' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Megaphone size={16} />
            <span>दुकान की पोस्ट्स ({shopPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 size={16} />
            <span>दुकान प्रोफाइल विवरण</span>
          </button>
        </div>

        <div>
          {activeTab === 'products' && (
            <button
              onClick={() => {
                setEditingProductId(null);
                setProdName('');
                setProdPrice('');
                setProdDiscountPrice('');
                setProdDesc('');
                setIsAddProductOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>+ Add Product (नया सामान जोड़ें)</span>
            </button>
          )}

          {activeTab === 'posts' && (
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex items-center space-x-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>+ Create Post (नई पोस्ट बनाएं)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {shopProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Package size={40} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">अभी कोई प्रोडक्ट नहीं जोड़ा गया है</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                अपनी दुकान पर मिलने वाले सामान, कीमतें और तस्वीरें जोड़ें ताकि ग्राहक उन्हें देख सकें।
              </p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                + पहला प्रोडक्ट जोड़ें
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                    <tr>
                      <th className="px-4 py-3">फोटो व नाम</th>
                      <th className="px-4 py-3">श्रेणी / कोड</th>
                      <th className="px-4 py-3">कीमत (Price)</th>
                      <th className="px-4 py-3">स्टॉक स्थिति (Stock)</th>
                      <th className="px-4 py-3 text-right">कार्य (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shopProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 flex items-center space-x-3">
                          <img src={prod.photoUrl} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                          <div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1">{prod.description}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col space-y-1">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold w-max">
                              {prod.category}
                            </span>
                            {prod.condition === 'used' ? (
                              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-extrabold w-max">
                                🔄 2nd Hand
                              </span>
                            ) : prod.condition === 'rent' ? (
                              <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded text-[10px] font-extrabold w-max">
                                🔑 Rent
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-extrabold w-max">
                                ✨ New
                              </span>
                            )}
                          </div>
                          {prod.productCode && <div className="text-[11px] text-slate-400 mt-0.5">{prod.productCode}</div>}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          <div className="text-slate-900 font-bold">₹{(prod.discountPrice || prod.price).toLocaleString('en-IN')}</div>
                          {prod.discountPrice && (
                            <div className="text-[11px] text-slate-400 line-through">₹{prod.price.toLocaleString('en-IN')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleProductStock(prod.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition flex items-center space-x-1 ${
                              prod.stockStatus === 'in_stock'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="स्टॉक स्थिति बदलने के लिए क्लिक करें"
                          >
                            {prod.stockStatus === 'in_stock' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            <span>{prod.stockStatus === 'in_stock' ? 'उपलब्ध (In Stock)' : 'स्टॉक समाप्त'}</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="एडिट करें"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('क्या आप इस प्रोडक्ट को हटाना चाहते हैं?')) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="डिलीट करें"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Posts Management */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {shopPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <Megaphone size={40} className="text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">अभी कोई पोस्ट नहीं डाली गई है</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                अपनी दुकान के नए स्टॉक, स्पेशल डिस्काउंट या त्यौहार ऑफर्स की पोस्ट डालें।
              </p>
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                + पहली पोस्ट बनाएं
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {post.status === 'active' ? '🟢 लाइव पोस्ट' : 'प्रतीक्षारत'}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('क्या आप इस पोस्ट को हटाना चाहते हैं?')) deletePost(post.id);
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      हटाएं
                    </button>
                  </div>

                  {post.offer && (
                    <div className="inline-block bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {post.offer}
                    </div>
                  )}

                  <h4 className="font-bold text-slate-900 text-base">{post.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3">{post.description}</p>

                  {post.photoUrl && (
                    <img src={post.photoUrl} alt={post.title} className="w-full h-40 object-cover rounded-xl" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Shop Profile Details */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveShopSettings} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 max-w-3xl">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">दुकान की सामान्य जानकारी अपडेट करें</h3>
            <p className="text-xs text-slate-500">यह जानकारी ग्राहकों को आपकी दुकान के पेज पर दिखाई देती है।</p>
          </div>

          {shopSavedNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center">
              <CheckCircle size={16} className="mr-2 text-emerald-600" />
              दुकान की जानकारी सफलतापूर्वक अपडेट हो गई है!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">दुकान का नाम</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">फ़ोन नंबर</label>
              <input
                type="text"
                value={shopMobile}
                onChange={(e) => setShopMobile(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp नंबर</label>
              <input
                type="text"
                value={shopWhatsapp}
                onChange={(e) => setShopWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">दुकान का पता</label>
            <input
              type="text"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">खुलने का समय</label>
              <input
                type="text"
                value={shopOpenTime}
                onChange={(e) => setShopOpenTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">बंद होने का समय</label>
              <input
                type="text"
                value={shopCloseTime}
                onChange={(e) => setShopCloseTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadField
              label="दुकान की मुख्य फ़ोटो (Shop Banner)"
              value={shopPhoto}
              onChange={setShopPhoto}
              helpText="दुकान के आगे की ताज़ा तस्वीर अपलोड करें"
            />
            <ImageUploadField
              label="दुकान का लोगो (Shop Logo)"
              value={shopLogo}
              onChange={setShopLogo}
              helpText="दुकान का साइनबोर्ड या लोगो"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">दुकान का विवरण (About)</label>
            <textarea
              rows={3}
              value={shopDesc}
              onChange={(e) => setShopDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer"
          >
            <Save size={16} />
            <span>जानकारी सेव करें</span>
          </button>
        </form>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold font-display text-base sm:text-lg">
                {editingProductId ? 'प्रोडक्ट संपादित करें (Edit Product)' : '+ नया प्रोडक्ट जोड़ें (Add Product)'}
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">प्रोडक्ट का नाम *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="उदा. OnePlus Nord CE 4 5G, पुरानी थ्रेशर, या लहँगा"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* Mandatory Product Condition Selector (नया / पुराना / किराये पर) */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-900 uppercase">
                    सामान की स्थिति (Product Condition) *
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    अनिवार्य फ़ील्ड
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  चुनें कि यह सामान बिल्कुल नया है, पुराना/सेकंड-हैंड है या किराये पर दिया जाने वाला है:
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setProdCondition('new')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      prodCondition === 'new'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-extrabold ring-2 ring-emerald-400'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles size={16} />
                    <span className="text-xs">✨ नया (New)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdCondition('used')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      prodCondition === 'used'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md font-extrabold ring-2 ring-amber-400'
                        : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <RefreshCw size={16} />
                    <span className="text-xs">🔄 पुराना / 2nd Hand</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdCondition('rent')}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                      prodCondition === 'rent'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md font-extrabold ring-2 ring-purple-400'
                        : 'bg-white hover:bg-purple-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Key size={16} />
                    <span className="text-xs">🔑 किराये पर (Rent)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">असली कीमत (MRP ₹) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="24999"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">डिस्काउंट रेट (₹)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value)}
                    placeholder="22499"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">श्रेणी (Category)</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    {SHOP_CATEGORIES.map(c => (
                      <option key={c.id} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">स्टॉक स्थिति</label>
                  <select
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="in_stock">स्टॉक में उपलब्ध (In Stock)</option>
                    <option value="out_of_stock">स्टॉक समाप्त (Out of Stock)</option>
                  </select>
                </div>
              </div>

              <ImageUploadField
                label="मुख्य कवर फ़ोटो (Primary Cover Photo)"
                value={prodPhoto}
                onChange={setProdPhoto}
                helpText="गैलरी या कैमरा से प्रोडक्ट की पहली मुख्य फ़ोटो चुनें"
                presetSamples={[
                  { label: 'मोबाइल', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80' },
                  { label: 'हेडफ़ोन', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80' },
                  { label: 'सूट/कपड़े', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
                  { label: 'मिठाई', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80' }
                ]}
              />

              {/* Multi-Photo Gallery Upload Section (Up to 5 Photos) */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryFileChange}
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase">
                    अतिरिक्त फ़ोटो (Multiple Photos - Up to 5 Photos)
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    {Math.min(5, 1 + prodGallery.length)} / 5 फ़ोटो चुनी गई हैं
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  ग्राहकों को प्रोडक्ट अलग-अलग कोणों से दिखाने के लिए फोन गैलरी या कैमरा से 4 से 5 फ़ोटो जोड़ें:
                </p>

                {/* Display thumbnail list of extra photos */}
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {/* Main Cover Photo Thumbnail */}
                  <div className="relative w-full h-16 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-2xs group">
                    <img src={prodPhoto} alt="Cover" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-black text-center py-0.5 uppercase">
                      मुख्य
                    </span>
                  </div>

                  {/* Additional Gallery Photos */}
                  {prodGallery.map((url, idx) => (
                    <div key={idx} className="relative w-full h-16 rounded-xl overflow-hidden border border-slate-300 group">
                      <img src={url} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProdGallery(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-0.5 rounded-full hover:bg-rose-700 shadow-md cursor-pointer"
                        title="हटाएं"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Add Photo Button if < 4 extra photos */}
                  {prodGallery.length < 4 && (
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="h-16 rounded-xl border-2 border-dashed border-amber-400 hover:border-amber-600 bg-amber-50/50 hover:bg-amber-100/80 text-amber-800 flex flex-col items-center justify-center transition cursor-pointer"
                    >
                      <PlusCircle size={18} className="text-amber-600" />
                      <span className="text-[9px] font-extrabold mt-0.5">+ फ़ोटो जोड़ें</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">विवरण (Description)</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="फीचर्स, वारंटी, रंग व साइज़ की जानकारी..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">प्रोडक्ट कोड (वैकल्पिक)</label>
                <input
                  type="text"
                  value={prodCode}
                  onChange={(e) => setProdCode(e.target.value)}
                  placeholder="उदा. PROD-101"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-md transition"
              >
                {editingProductId ? 'अपडेट सेव करें' : '+ प्रोडक्ट जोड़ें'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold font-display text-base sm:text-lg">
                📢 नई दुकान पोस्ट बनाएं (Create Post)
              </h3>
              <button onClick={() => setIsCreatePostOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">पोस्ट शीर्षक (Title) *</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="उदा. आज नया 5G मोबाइल स्टॉक आ चुका है!"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">विशेष ऑफर टैग (Offer Badge)</label>
                <input
                  type="text"
                  value={postOffer}
                  onChange={(e) => setPostOffer(e.target.value)}
                  placeholder="उदा. 10% छूट या Buy 1 Get 1 Free"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">पोस्ट का विवरण (Description) *</label>
                <textarea
                  rows={4}
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  placeholder="ग्राहकों को बताएं कि क्या नया आया है, क्या खासियत है और दुकान पर कैसे संपर्क करें..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <ImageUploadField
                label="पोस्ट की फ़ोटो या ऑफ़र बैनर (Post Photo / Banner)"
                value={postPhoto}
                onChange={setPostPhoto}
                helpText="गैलरी से दुकान के नए स्टॉक या ऑफर की फ़ोटो अपलोड करें"
                presetSamples={[
                  { label: 'मोबाइल स्टॉक', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80' },
                  { label: 'स्वीट्स ऑफर', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
                  { label: 'कपड़े सेल', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80' }
                ]}
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">वीडियो लिंक (वैकल्पिक)</label>
                <input
                  type="url"
                  value={postVideoUrl}
                  onChange={(e) => setPostVideoUrl(e.target.value)}
                  placeholder="YouTube या Reel लिंक"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl text-xs text-amber-900">
                नोट: पोस्ट के साथ हमेशा दुकान का नाम <strong>"Posted by {userShop.shopName}"</strong> दिखाई देगा।
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 rounded-xl font-bold shadow-md transition"
              >
                पोस्ट पब्लिश करें (Publish Post)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
