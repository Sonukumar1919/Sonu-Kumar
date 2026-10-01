import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Star, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  Package, 
  Megaphone, 
  Tag, 
  Image as ImageIcon, 
  Info, 
  UserCheck, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Shop } from '../types';
import { ProductsGrid } from './ProductsGrid';
import { PostsFeed } from './PostsFeed';

interface ShopChannelViewProps {
  shop: Shop;
  onBack: () => void;
  onOpenAuth: () => void;
}

export const ShopChannelView: React.FC<ShopChannelViewProps> = ({ 
  shop, 
  onBack,
  onOpenAuth 
}) => {
  const { 
    products, 
    posts, 
    isShopSaved, 
    toggleSaveShop, 
    currentUser,
    updateShop 
  } = useApp();

  const [activeChannelTab, setActiveChannelTab] = useState<'about' | 'products' | 'posts' | 'offers' | 'photos'>('about');
  const [followed, setFollowed] = useState(false);

  const saved = isShopSaved(shop.id);
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const shopPosts = posts.filter(p => p.shopId === shop.id && p.status === 'active');
  const shopOffers = shopPosts.filter(p => !!p.offer);

  const handleCall = () => {
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  const handleWhatsApp = () => {
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`नमस्ते ${shop.shopName}! मैंने आपकी दुकान का डिजिटल चैनल RAWLA MANDI पर देखा है। मुझे कुछ जानकारी चाहिए।`);
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleLocation = () => {
    if (shop.googleMapLocation) {
      window.open(shop.googleMapLocation, '_blank');
    } else {
      window.open(`https://maps.google.com/?q=${encodeURIComponent('Rawla Mandi ' + shop.shopName + ' ' + shop.address)}`, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${shop.shopName} - Rawla Mandi`,
        text: `रावला मंडी में ${shop.shopName} की डिजिटल दुकान देखें। पता: ${shop.address}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      const text = encodeURIComponent(`🏪 ${shop.shopName}\n📍 ${shop.address}, रावla Mandi\n📞 ${shop.mobileNumber}\nडिजिटल चैनल देखें: ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleFollow = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setFollowed(!followed);
    updateShop(shop.id, {
      followersCount: (shop.followersCount || 0) + (followed ? -1 : 1)
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-amber-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs mb-4 transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>सभी दुकानें (Back to Market)</span>
      </button>

      {/* Main Channel Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        
        {/* Banner Cover Image */}
        <div className="relative h-48 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={shop.photoUrl}
            alt={shop.shopName}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent"></div>

          {/* Category Tag */}
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {shop.category}
          </div>

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-xl transition cursor-pointer"
              title="शेयर करें"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => {
                if (!currentUser) onOpenAuth();
                else toggleSaveShop(shop.id);
              }}
              className={`p-2.5 rounded-xl backdrop-blur-md transition cursor-pointer ${
                saved ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
              title={saved ? 'दुकान सेव है' : 'दुकान सेव करें'}
            >
              <Bookmark size={16} className={saved ? 'fill-white' : ''} />
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-4 sm:px-8 pb-6 pt-4 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between -mt-16 sm:-mt-20 gap-4">
            
            {/* Logo + Titles */}
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-xl border-2 border-white overflow-hidden shrink-0">
                <img
                  src={shop.logoUrl || shop.photoUrl}
                  alt={shop.shopName}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="pt-8 sm:pt-14 space-y-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                    {shop.shopName}
                  </h1>
                  <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                    <ShieldCheck size={14} className="mr-1 text-emerald-600" />
                    सत्यापित डिजिटल दुकान
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center flex-wrap gap-2">
                  <span>संचालक: <strong className="text-slate-700">{shop.ownerName}</strong></span>
                  <span>•</span>
                  <span className="flex items-center text-amber-700">
                    <MapPin size={13} className="mr-1" />
                    {shop.area}
                  </span>
                </p>
              </div>
            </div>

            {/* Follow / Save CTA */}
            <div className="flex items-center space-x-2 self-start md:self-end pt-2">
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer ${
                  followed 
                    ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <UserCheck size={16} />
                <span>{followed ? 'फॉलो किया गया ✓' : '+ फॉलो करें (Follow)'}</span>
              </button>
            </div>
          </div>

          {/* Quick Contact Buttons Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={handleCall}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm shadow-blue-500/25 transition cursor-pointer"
            >
              <Phone size={18} />
              <span>कॉल करें ({shop.mobileNumber})</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-500/25 transition cursor-pointer"
            >
              <MessageCircle size={18} />
              <span>WhatsApp चैट</span>
            </button>

            <button
              onClick={handleLocation}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-sm shadow-amber-500/25 transition cursor-pointer"
            >
              <MapPin size={18} />
              <span>Google Maps लोकेशन</span>
            </button>
          </div>

          {/* Navigation Tabs inside Shop Channel */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pt-6 border-b border-slate-200">
            <button
              onClick={() => setActiveChannelTab('about')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
                activeChannelTab === 'about'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info size={16} />
              <span>About (परिचय)</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('products')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
                activeChannelTab === 'products'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package size={16} />
              <span>Products ({shopProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('posts')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
                activeChannelTab === 'posts'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Megaphone size={16} />
              <span>Posts ({shopPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('offers')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
                activeChannelTab === 'offers'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Tag size={16} />
              <span>Offers ({shopOffers.length})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('photos')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
                activeChannelTab === 'photos'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon size={16} />
              <span>Photos</span>
            </button>
          </div>

          {/* Channel Tab Content */}
          <div className="pt-6">
            {activeChannelTab === 'about' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">दुकान के बारे में (Description)</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {shop.description}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">दुकानदार का संदेश</h4>
                    <p className="text-xs sm:text-sm text-amber-950 font-medium">
                      “हम अपने सभी ग्राहकों को उत्तम गुणवत्ता और उचित मूल्य की गारंटी देते हैं। किसी भी जानकारी के लिए सीधे कॉल या व्हाट्सएप करें।”
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">संपर्क व समय सारिणी</h4>
                    
                    <div className="flex items-start space-x-2 text-xs text-slate-700">
                      <Clock size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">दुकान खुलने का समय</div>
                        <div>{shop.openingTime} से {shop.closingTime} तक</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-slate-700">
                      <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">पता (Shop Address)</div>
                        <div>{shop.address}</div>
                        <div className="text-slate-500 font-medium">क्षेत्र: {shop.area}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-slate-700">
                      <Phone size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">फ़ोन नंबर</div>
                        <div>+91 {shop.mobileNumber}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-slate-700">
                      <MessageCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">WhatsApp नंबर</div>
                        <div>+91 {shop.whatsappNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChannelTab === 'products' && (
              <ProductsGrid
                filterShopId={shop.id}
                onSelectShop={() => {}}
                onOpenAuth={onOpenAuth}
              />
            )}

            {activeChannelTab === 'posts' && (
              <PostsFeed
                filterShopId={shop.id}
                onSelectShop={() => {}}
                onOpenAuth={onOpenAuth}
              />
            )}

            {activeChannelTab === 'offers' && (
              <div className="space-y-4">
                {shopOffers.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl text-slate-500 text-sm">
                    वर्तमान में कोई सक्रिय विशेष ऑफर नहीं है। नियमित ऑफर्स के लिए दुकान को फॉलो करें।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shopOffers.map(post => (
                      <div key={post.id} className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 rounded-2xl p-4 space-y-2">
                        <div className="inline-block bg-orange-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md">
                          {post.offer}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{post.title}</h4>
                        <p className="text-xs text-slate-600">{post.description}</p>
                        <button
                          onClick={handleWhatsApp}
                          className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition"
                        >
                          ऑफर के लिए व्हाट्सएप करें &gt;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeChannelTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={shop.photoUrl} alt="Store front" className="w-full h-full object-cover" />
                </div>
                {shop.logoUrl && (
                  <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={shop.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                )}
                {shopProducts.slice(0, 4).map(p => (
                  <div key={p.id} className="h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
