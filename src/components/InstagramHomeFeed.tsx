import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Phone, 
  Share2, 
  Bookmark, 
  Store, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Bell, 
  Flame, 
  Megaphone, 
  Eye, 
  Clock, 
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Shop, ShopPost } from '../types';
import { ProductDetailModal } from './ProductDetailModal';

interface InstagramHomeFeedProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
}

export const InstagramHomeFeed: React.FC<InstagramHomeFeedProps> = ({ 
  onSelectShop, 
  onOpenAuth 
}) => {
  const { 
    products, 
    shops, 
    posts, 
    systemSettings, 
    currentUser, 
    isProductSaved, 
    toggleSaveProduct, 
    likePost 
  } = useApp();

  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<{ title: string; desc: string; type: string; image?: string; linkShop?: Shop } | null>(null);
  const [likedProductIds, setLikedProductIds] = useState<Record<string, boolean>>({});
  const [doubleTapHeartId, setDoubleTapHeartId] = useState<string | null>(null);

  // Active products strictly sorted newest first (Newest product at the very top)
  const activeProducts = [...products]
    .filter(p => {
      const shop = shops.find(s => s.id === p.shopId);
      if (shop && (shop.status === 'blocked' || shop.status === 'rejected')) {
        return false;
      }
      return p.status === 'active' || !p.status;
    })
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  // Dynamic notices & status updates for top "सूचना" bar
  const noticesList = [
    {
      id: 'suchna-1',
      title: 'आज की मुख्य सूचना',
      subtitle: 'रावला मंडी अपडेट',
      type: 'mandi',
      icon: '📢',
      desc: systemSettings.tickerNotice || 'रावला मंडी डिजिटल बाज़ार में आज की सभी दुकानों के नये प्रोडक्ट्स व दैनिक सूचनाएं लाइव हैं।',
      gradient: 'from-amber-500 via-orange-500 to-rose-500'
    },
    {
      id: 'suchna-2',
      title: 'ताज़ा नया स्टॉक',
      subtitle: 'New Stock Live',
      type: 'stock',
      icon: '⚡',
      desc: 'आज कई दुकानों द्वारा नया सामान, कपड़े, इलेक्ट्रॉनिक्स, मोबाइल और कृषि उपकरण जोड़े गए हैं। नीचे स्क्रॉल करें!',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    },
    {
      id: 'suchna-3',
      title: 'धमाकेदार ऑफर्स',
      subtitle: 'छूट व डिस्काउंट',
      type: 'offer',
      icon: '🎉',
      desc: systemSettings.bannerNotice || 'दुकानदारों के विशेष त्योहारी डिस्काउंट व बंपर ऑफर्स की जानकारी सीधे प्राप्त करें।',
      gradient: 'from-rose-500 via-pink-500 to-purple-500'
    },
    {
      id: 'suchna-4',
      title: 'सक्रिय दुकानें',
      subtitle: 'कुल ' + shops.filter(s => s.status === 'active').length + ' दुकानें',
      type: 'shops',
      icon: '🏪',
      desc: 'रावला मंडी, मुख्य बाज़ार, धानमंडी व 8PSD क्षेत्र की सत्यापित दुकानें अब डिजिटल पोर्टल पर उपलब्ध हैं।',
      gradient: 'from-blue-500 via-indigo-500 to-violet-500'
    }
  ];

  // Double tap to like on mobile/desktop
  const handleDoubleTap = (productId: string) => {
    setLikedProductIds(prev => ({ ...prev, [productId]: true }));
    setDoubleTapHeartId(productId);
    setTimeout(() => {
      setDoubleTapHeartId(null);
    }, 900);
  };

  const handleWhatsApp = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI पर आपका प्रोडक्ट "${product.name}" (कीमत: ₹${product.discountPrice || product.price}) देखा है। मुझे यह प्रोडक्ट खरीदना है।`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  const handleShare = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `📦 ${product.name} (₹${product.discountPrice || product.price}) - ${product.shopName}, Rawla Mandi`,
        url: window.location.href
      }).catch(() => {});
    } else {
      const text = encodeURIComponent(`📦 ${product.name}\n💰 कीमत: ₹${product.discountPrice || product.price}\n🏪 दुकान: ${product.shopName}\nदेखें: ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-4 py-2 space-y-4 font-sans">
      
      {/* ============================================================== */}
      {/* 1. सूचना (INSTAGRAM STORIES / STATUS BAR AT TOP) */}
      {/* ============================================================== */}
      <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-sm backdrop-blur-md transition-colors">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight font-display flex items-center space-x-1">
              <span>📢 सूचना व स्टेटस (Daily Updates)</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full">
            लाइव अपडेट
          </span>
        </div>

        {/* Horizontal Status Bubbles (Stories Scroll) */}
        <div className="flex items-center space-x-3.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar select-none">
          {noticesList.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedNotice({
                title: item.title,
                desc: item.desc,
                type: item.type
              })}
              className="flex flex-col items-center space-y-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
            >
              {/* Glowing Story Ring */}
              <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr ${item.gradient} transition-transform transform group-hover:scale-105 active:scale-95 shadow-sm`}>
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full p-1 flex items-center justify-center">
                  <div className={`w-full h-full rounded-full bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center text-xl sm:text-2xl shadow-inner`}>
                    {item.icon}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight text-center max-w-[70px] truncate leading-tight">
                {item.title}
              </span>
            </button>
          ))}

          {/* Shop stories from active shops with offers */}
          {shops.filter(s => s.status === 'active').slice(0, 6).map((shop) => (
            <button
              key={shop.id}
              onClick={() => onSelectShop(shop)}
              className="flex flex-col items-center space-y-1.5 shrink-0 group cursor-pointer focus:outline-hidden"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 transition-transform transform group-hover:scale-105 active:scale-95 shadow-sm">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full p-1 flex items-center justify-center">
                  <img
                    src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80'}
                    alt={shop.shopName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-tight text-center max-w-[70px] truncate leading-tight">
                {shop.shopName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PRODUCT FEED (INSTAGRAM POSTS STYLE - SWIPE UP TO BROWSE) */}
      {/* ============================================================== */}
      <div className="space-y-5">
        {activeProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
            <Sparkles size={40} className="text-amber-500 mx-auto animate-bounce" />
            <h3 className="font-black text-slate-800 text-lg">अभी कोई प्रोडक्ट उपलब्ध नहीं है</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              दुकानदार अपने डैशबोर्ड से जैसे ही नया प्रोडक्ट जोड़ेंगे, वह तुरंत यहाँ लाइव दिखाई देगा।
            </p>
          </div>
        ) : (
          activeProducts.map((product, pIndex) => (
            <InstagramProductCard
              key={product.id}
              product={product}
              isFirst={pIndex === 0}
              isSaved={isProductSaved(product.id)}
              isLiked={!!likedProductIds[product.id]}
              isDoubleTapActive={doubleTapHeartId === product.id}
              onDoubleTap={() => handleDoubleTap(product.id)}
              onToggleSave={() => {
                if (!currentUser) onOpenAuth();
                else toggleSaveProduct(product.id);
              }}
              onToggleLike={() => {
                setLikedProductIds(prev => ({ ...prev, [product.id]: !prev[product.id] }));
              }}
              onOpenDetail={() => setSelectedDetailProduct(product)}
              onSelectShop={onSelectShop}
              onCall={(e) => handleCall(e, product)}
              onWhatsApp={(e) => handleWhatsApp(e, product)}
              onShare={(e) => handleShare(e, product)}
            />
          ))
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. MODALS: DETAIL MODAL WITH 0.5s LOADER & SUCHNA STORY MODAL */}
      {/* ============================================================== */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onSelectShop={onSelectShop}
          onOpenAuth={onOpenAuth}
        />
      )}

      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 relative">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl">
              📢
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">
                {selectedNotice.title}
              </h3>
              <p className="text-xs font-semibold text-amber-600 mt-0.5">
                रावला मंडी आधिकारिक सूचना
              </p>
            </div>
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {selectedNotice.desc}
            </div>
            <button
              onClick={() => setSelectedNotice(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs cursor-pointer shadow-md"
            >
              ठीक है (बंद करें)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

/* ========================================================================= */
/* SINGLE INSTAGRAM-STYLE PRODUCT CARD (SWIPE LEFT/RIGHT FOR MULTI PICTURES) */
/* ========================================================================= */
interface InstagramProductCardProps {
  product: Product;
  isFirst: boolean;
  isSaved: boolean;
  isLiked: boolean;
  isDoubleTapActive: boolean;
  onDoubleTap: () => void;
  onToggleSave: () => void;
  onToggleLike: () => void;
  onOpenDetail: () => void;
  onSelectShop: (shop: Shop) => void;
  onCall: (e: React.MouseEvent) => void;
  onWhatsApp: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}

const InstagramProductCard: React.FC<InstagramProductCardProps> = ({
  product,
  isFirst,
  isSaved,
  isLiked,
  isDoubleTapActive,
  onDoubleTap,
  onToggleSave,
  onToggleLike,
  onOpenDetail,
  onSelectShop,
  onCall,
  onWhatsApp,
  onShare
}) => {
  const { shops } = useApp();
  const shop = shops.find(s => s.id === product.shopId);

  // Gallery images array
  const allPhotos: string[] = [];
  if (product.photoUrl) allPhotos.push(product.photoUrl);
  if (product.galleryUrls && Array.isArray(product.galleryUrls)) {
    product.galleryUrls.forEach(url => {
      if (url && !allPhotos.includes(url)) allPhotos.push(url);
    });
  }
  if (allPhotos.length === 0) {
    allPhotos.push('https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80');
  }

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Touch swipe gestures for multi-photos (Swipe Left / Right)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      // Swiped Left -> Next photo
      setActivePhotoIdx(prev => (prev >= allPhotos.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      // Swiped Right -> Prev photo
      setActivePhotoIdx(prev => (prev <= 0 ? allPhotos.length - 1 : prev - 1));
    }
    touchStartX.current = null;
  };

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md backdrop-blur-md">
      
      {/* 1. Header (Shop Profile Avatar & Name) */}
      <div className="p-3 sm:p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div 
          onClick={() => shop && onSelectShop(shop)}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          {/* Shop Avatar with Instagram Ring */}
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-rose-500 shrink-0">
            <img
              src={shop?.logoUrl || shop?.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80'}
              alt={product.shopName}
              className="w-full h-full rounded-full object-cover bg-white dark:bg-slate-800"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition truncate max-w-[200px]">
                {product.shopName}
              </span>
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
              {shop?.area || 'रावला मंडी'}
            </p>
          </div>
        </div>

        {/* Direct Call / Contact Button in Header */}
        <div className="flex items-center space-x-1.5">
          {isFirst && (
            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
              NEW ✨
            </span>
          )}
          <button
            onClick={onCall}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
            title="दुकान पर कॉल करें"
          >
            <Phone size={14} className="text-blue-500" />
          </button>
        </div>
      </div>

      {/* 2. Media Carousel (Swipe Left/Right for Multi Pictures & Double Tap Heart) */}
      <div 
        className="relative aspect-square sm:aspect-[4/3] w-full bg-slate-950 overflow-hidden cursor-pointer select-none"
        onDoubleClick={onDoubleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onOpenDetail}
      >
        <img
          src={allPhotos[activePhotoIdx]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />

        {/* Double-tap animated heart pop */}
        {isDoubleTapActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 duration-200">
            <Heart size={80} className="text-rose-500 fill-rose-500 drop-shadow-2xl animate-ping" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.condition === 'used' ? (
            <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              🔄 2nd Hand
            </span>
          ) : product.condition === 'rent' ? (
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              🔑 Rent
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              ✨ New
            </span>
          )}
        </div>

        {/* Multi-photo indicator badge (e.g. 1/3 फ़ोटो) */}
        {allPhotos.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10 pointer-events-none">
            {activePhotoIdx + 1} / {allPhotos.length} फ़ोटो (स्वाइप करें 👉)
          </div>
        )}

        {/* Left / Right Carousel Buttons on Hover */}
        {allPhotos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx(prev => (prev <= 0 ? allPhotos.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer z-20 shadow-md"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIdx(prev => (prev >= allPhotos.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer z-20 shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* 3. Carousel Dots (Instagram Dots Indicator) */}
      {allPhotos.length > 1 && (
        <div className="flex items-center justify-center space-x-1.5 py-2 bg-slate-50 border-b border-slate-100">
          {allPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIdx(idx)}
              className={`rounded-full transition-all cursor-pointer ${
                activePhotoIdx === idx 
                  ? 'w-4 h-1.5 bg-amber-500' 
                  : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* 4. Action Bar (Like, Save, Share, Direct Order) */}
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Heart Like */}
            <button
              onClick={onToggleLike}
              className={`flex items-center space-x-1 text-xs font-bold transition cursor-pointer ${
                isLiked ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300 hover:text-rose-600'
              }`}
            >
              <Heart size={20} className={isLiked ? 'fill-rose-600' : ''} />
              <span>{isLiked ? 'पसंद है' : 'लाइक'}</span>
            </button>

            {/* Share */}
            <button
              onClick={onShare}
              className="flex items-center space-x-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <Share2 size={18} />
              <span>शेयर</span>
            </button>

            {/* Save */}
            <button
              onClick={onToggleSave}
              className={`flex items-center space-x-1 text-xs font-bold transition cursor-pointer ${
                isSaved ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300 hover:text-amber-600'
              }`}
            >
              <Bookmark size={18} className={isSaved ? 'fill-amber-600 dark:fill-amber-400' : ''} />
              <span>{isSaved ? 'सेव है' : 'सेव'}</span>
            </button>
          </div>

          {/* Price Tag */}
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-400 line-through ml-1.5">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* 5. Product Title & Description (No time shown) */}
        <div onClick={onOpenDetail} className="cursor-pointer space-y-1">
          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition leading-snug">
            {product.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-block pt-0.5">
            पूरा विवरण व फोटो देखें &gt;
          </span>
        </div>

        {/* 6. Direct Order Buttons (Call & WhatsApp) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onCall}
            className="flex items-center justify-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            <Phone size={14} className="text-blue-500" />
            <span>कॉल करें</span>
          </button>
          <button
            onClick={onWhatsApp}
            className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
          >
            <MessageCircle size={15} />
            <span>व्हाट्सएप पूछताछ</span>
          </button>
        </div>

      </div>

    </div>
  );
};
