import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Phone, 
  Store, 
  CheckCircle,
  Tag,
  Images
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Shop } from '../types';
import { ProductDetailModal } from './ProductDetailModal';

interface SuperNewProductsSliderProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
}

export const SuperNewProductsSlider: React.FC<SuperNewProductsSliderProps> = ({ 
  onSelectShop, 
  onOpenAuth 
}) => {
  const { products, shops, toggleSaveProduct, isProductSaved, currentUser, systemSettings } = useApp();
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Active products sorted by newest first (Super New Products)
  const activeProducts = products
    .filter(p => {
      const shop = shops.find(s => s.id === p.shopId);
      return (shop ? shop.status === 'active' : true) && (p.status === 'active' || !p.status);
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch and mouse drag swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  // Responsive items per view: mobile 1, tablet 2, desktop 3
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, activeProducts.length - itemsPerView);

  // Automatic swipe timer (swipes every 3.5 seconds)
  useEffect(() => {
    if (isPaused || activeProducts.length <= itemsPerView) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex, activeProducts.length, itemsPerView]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch swipe support (Mobile)
  const minSwipeDistance = 25;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setIsPaused(false);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag support (Desktop / Laptop)
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setIsMouseDown(true);
    setIsPaused(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX === null) return;
    const distance = mouseStartX - e.clientX;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setIsMouseDown(false);
    setMouseStartX(null);
    setIsPaused(false);
  };

  const handleWhatsApp = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI पर आपका नया प्रोडक्ट "${product.name}" (₹${product.discountPrice || product.price}) देखा है। मुझे यह खरीदना है।`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  if (activeProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 animate-bounce">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                {systemSettings.heroSuperNewTitle || '⚡ SUPER NEW PRODUCTS'}
              </h2>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center space-x-1">
                <span>Auto & Touch Swipe 🔄</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {systemSettings.heroSuperNewSubtitle || 'रावला मंडी में आज का बिल्कुल नया स्टॉक व सामान (स्वाइप करके देखें)'}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
            title="पिछला प्रोडक्ट"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
            title="अगला प्रोडक्ट"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider Carousel Container with Touch & Drag Support */}
      <div 
        className="relative overflow-hidden rounded-3xl touch-pan-y select-none cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); setIsMouseDown(false); }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {activeProducts.map((product) => {
            const shop = shops.find(s => s.id === product.shopId);
            const saved = isProductSaved(product.id);
            const discountPercent = product.discountPrice 
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            const totalPhotoCount = (product.galleryUrls && product.galleryUrls.length > 0)
              ? product.galleryUrls.length
              : 1;

            return (
              <div 
                key={product.id}
                className="px-2 shrink-0 cursor-pointer"
                style={{ width: `${100 / itemsPerView}%` }}
                onClick={() => setSelectedDetailProduct(product)}
              >
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group hover:border-amber-400 relative overflow-hidden">
                  
                  {/* Top New Tag */}
                  <div className="absolute top-5 left-5 z-10 flex items-center space-x-1.5">
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles size={10} />
                      <span>NEW</span>
                    </span>
                    {discountPercent > 0 && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                        {discountPercent}% OFF
                      </span>
                    )}
                    {totalPhotoCount > 1 && (
                      <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-md flex items-center space-x-1">
                        <Images size={10} />
                        <span>{totalPhotoCount} फ़ोटो</span>
                      </span>
                    )}
                  </div>

                  {/* Save button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!currentUser) onOpenAuth();
                      else toggleSaveProduct(product.id);
                    }}
                    className={`absolute top-5 right-5 z-10 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                      saved 
                        ? 'bg-rose-500 text-white shadow-md' 
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                  >
                    <Heart size={14} className={saved ? 'fill-white' : ''} />
                  </button>

                  {/* Product Image */}
                  <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-slate-100 mb-3">
                    <img
                      src={product.photoUrl || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-700 pointer-events-none"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Category & Condition pill */}
                    <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                      {product.condition === 'used' ? (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          🔄 2nd Hand
                        </span>
                      ) : product.condition === 'rent' ? (
                        <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          🔑 Rent
                        </span>
                      ) : (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          ✨ New
                        </span>
                      )}
                      <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Shop Name & link */}
                      {shop && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); onSelectShop(shop); }}
                          className="flex items-center text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer truncate mb-1"
                        >
                          <Store size={12} className="mr-1 shrink-0" />
                          <span className="truncate">{shop.shopName}</span>
                        </div>
                      )}

                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition line-clamp-1 leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Contact Buttons */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-baseline space-x-2 mb-2.5">
                        <span className="text-lg sm:text-xl font-black text-slate-900">
                          ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                        </span>
                        {product.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => handleCall(e, product)}
                          className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <Phone size={12} className="text-blue-600" />
                          <span>{systemSettings.callButtonText || 'कॉल'}</span>
                        </button>
                        <button
                          onClick={(e) => handleWhatsApp(e, product)}
                          className="flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                        >
                          <MessageCircle size={12} />
                          <span>{systemSettings.whatsappButtonText || 'WhatsApp'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress indicators dots */}
      <div className="flex items-center justify-center space-x-1.5 mt-3">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx 
                ? 'w-6 bg-amber-500' 
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            title={`स्लाइड ${idx + 1}`}
          />
        ))}
      </div>

      {/* Product Gallery & Details Modal */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          onSelectShop={onSelectShop}
          onOpenAuth={onOpenAuth}
        />
      )}
    </div>
  );
};
