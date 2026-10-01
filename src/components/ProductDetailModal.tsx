import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Store, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  Key, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  Share2,
  Tag
} from 'lucide-react';
import { Product, Shop } from '../types';
import { useApp } from '../context/AppContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectShop,
  onOpenAuth
}) => {
  if (!product) return null;

  const { shops, isProductSaved, toggleSaveProduct, currentUser } = useApp();

  const shop = shops.find(s => s.id === product.shopId);
  const saved = isProductSaved(product.id);

  // Combine photoUrl and galleryUrls into a single array of up to 5 unique photos
  const allPhotos: string[] = [];
  if (product.photoUrl) allPhotos.push(product.photoUrl);
  if (product.galleryUrls && Array.isArray(product.galleryUrls)) {
    product.galleryUrls.forEach(url => {
      if (url && !allPhotos.includes(url)) {
        allPhotos.push(url);
      }
    });
  }

  // Ensure at least 1 photo
  if (allPhotos.length === 0) {
    allPhotos.push('https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80');
  }

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const cond = product.condition || 'new';

  const handleNextPhoto = () => {
    setActivePhotoIndex(prev => (prev + 1) % allPhotos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleWhatsApp = () => {
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI पर आपका प्रोडक्ट "${product.name}" (कीमत: ₹${product.discountPrice || product.price}) देखा है। मुझे इस प्रोडक्ट के बारे में अधिक जानकारी चाहिए।`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} (₹${product.discountPrice || product.price}) - ${product.shopName}, Rawla Mandi`,
        url: window.location.href
      }).catch(() => {});
    } else {
      const text = encodeURIComponent(`📦 ${product.name}\n💰 कीमत: ₹${product.discountPrice || product.price}\n🏪 दुकान: ${product.shopName}\nविवरण देखें: ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 truncate pr-2">
            <span className="font-extrabold text-sm sm:text-base truncate">{product.name}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="शेयर करें"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => {
                if (!currentUser) onOpenAuth();
                else toggleSaveProduct(product.id);
              }}
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                saved ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={saved ? 'सेव्ड है' : 'सेव करें'}
            >
              <Heart size={16} className={saved ? 'fill-white' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="बंद करें"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl bg-slate-950 overflow-hidden group shadow-md">
              <img
                src={allPhotos[activePhotoIndex]}
                alt={`${product.name} - Photo ${activePhotoIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Counter Badge */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                🖼️ {activePhotoIndex + 1} / {allPhotos.length} फ़ोटो
              </div>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                  {discountPercent}% OFF
                </div>
              )}

              {/* Navigation Arrows if > 1 photo */}
              {allPhotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                    title="पिछली फ़ोटो"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                    title="अगली फ़ोटो"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Row (Up to 5 Photos) */}
            {allPhotos.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {allPhotos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      activePhotoIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-400/50 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Badges & Titles */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {/* Condition Badge */}
              {cond === 'used' ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg font-extrabold text-xs flex items-center space-x-1 shadow-2xs">
                  <RefreshCw size={13} />
                  <span>🔄 पुराना / 2nd Hand</span>
                </span>
              ) : cond === 'rent' ? (
                <span className="bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1 rounded-lg font-extrabold text-xs flex items-center space-x-1 shadow-2xs">
                  <Key size={13} />
                  <span>🔑 किराये पर (Rent)</span>
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg font-extrabold text-xs flex items-center space-x-1 shadow-2xs">
                  <Sparkles size={13} />
                  <span>✨ नया (Brand New)</span>
                </span>
              )}

              {/* Stock Status */}
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                product.stockStatus === 'in_stock' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
              }`}>
                {product.stockStatus === 'in_stock' ? <CheckCircle size={13} /> : <XCircle size={13} />}
                <span>{product.stockStatus === 'in_stock' ? 'स्टॉक में उपलब्ध' : 'आउट ऑफ़ स्टॉक'}</span>
              </span>

              <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase block">विक्रय मूल्य (Special Offer Rate)</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  )}
                  {cond === 'rent' && (
                    <span className="text-xs font-bold text-purple-700">/किराया दर</span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-emerald-200">
                  बचत: ₹{(product.price - (product.discountPrice || product.price)).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase">विवरण (Product Details)</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-100">
              {product.description || 'इस प्रोडक्ट के लिए कोई विस्तृत विवरण उपलब्ध नहीं है।'}
            </p>
          </div>

          {/* Shop Card */}
          {shop && (
            <div 
              onClick={() => {
                onClose();
                onSelectShop(shop);
              }}
              className="bg-amber-50/80 hover:bg-amber-100/80 transition p-4 rounded-2xl border border-amber-200 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={shop.logoUrl || shop.photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=200&q=80'}
                  alt={shop.shopName}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-200 shrink-0"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-sm text-slate-900">{shop.shopName}</span>
                    <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{shop.area} • संचालक: {shop.ownerName}</div>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg shrink-0">
                दुकान देखें &gt;
              </span>
            </div>
          )}

          {/* Contact Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleCall}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
            >
              <Phone size={16} className="text-amber-400" />
              <span>सीधे कॉल करें</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-md"
            >
              <MessageCircle size={16} />
              <span>WhatsApp पर ऑर्डर करें</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
