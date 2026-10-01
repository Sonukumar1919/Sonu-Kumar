import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  Bookmark, 
  Share2, 
  Store, 
  ShieldCheck, 
  Tag, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopPost, Shop } from '../types';

interface TopRatedPostsSliderProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  onTopPostIdsChange?: (ids: string[]) => void;
}

export const TopRatedPostsSlider: React.FC<TopRatedPostsSliderProps> = ({ 
  onSelectShop, 
  onOpenAuth,
  onTopPostIdsChange 
}) => {
  const { posts, shops, likePost, toggleSavePost, isPostSaved, currentUser, systemSettings } = useApp();

  // Filter active posts and sort by highest likes / popularity
  const sortedTopPosts = [...posts]
    .filter(p => p.status === 'active')
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5); // Top 5 highest liked/rated posts

  useEffect(() => {
    if (onTopPostIdsChange) {
      onTopPostIdsChange(sortedTopPosts.map(p => p.id));
    }
  }, [posts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = sortedTopPosts.length;

  // Strict 5-Second Auto Swipe as requested by user
  useEffect(() => {
    if (isPaused || total <= 1) return;

    setProgressKey(prev => prev + 1);

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= total - 1 ? 0 : prev + 1));
      setProgressKey(prev => prev + 1);
    }, 5000); // Exactly 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, total]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? total - 1 : prev - 1));
    setProgressKey(prev => prev + 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= total - 1 ? 0 : prev + 1));
    setProgressKey(prev => prev + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  const handleShare = (post: ShopPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title} - ${post.shopName} (Rawla Mandi)`,
        url: window.location.href
      }).catch(() => {});
    } else {
      const text = encodeURIComponent(`🔥 ${post.title}\nदुकान: ${post.shopName} (रावला मंडी)\n${post.description}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleWhatsApp = (e: React.MouseEvent, post: ShopPost) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === post.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI पर आपकी यह लोकप्रिय पोस्ट देखी है: "${post.title}". मुझे इसके बारे में जानकारी चाहिए।`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent, post: ShopPost) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === post.shopId);
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  if (total === 0) return null;

  const currentPost = sortedTopPosts[currentIndex];
  const currentShop = shops.find(s => s.id === currentPost.shopId);
  const isSaved = isPostSaved(currentPost.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                {systemSettings.heroTopRatedTitle || '🔥 सर्वाधिक पसंद व लोकप्रिय पोस्ट्स (Trending Posts)'}
              </h2>
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                <Clock size={10} className="animate-spin" />
                <span>5-SEC AUTO SWIPE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {systemSettings.heroTopRatedSubtitle || 'ग्राहकों द्वारा सबसे ज्यादा लाइक व रेटिंग वाली पोस्ट्स (हर 5 सेकंड में स्वतः बदलेगी)'}
            </p>
          </div>
        </div>

        {/* Counter and manual controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 font-mono hidden sm:inline-block">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
            title="पिछली पोस्ट"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 flex items-center justify-center transition shadow-2xs cursor-pointer"
            title="अगली पोस्ट"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main 5-Second Swipe Card */}
      <div 
        className="relative bg-white rounded-3xl border-2 border-rose-200/80 shadow-lg overflow-hidden transition-all duration-500"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 5-Second Animated Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
          <div 
            key={progressKey}
            className={`h-full bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 transition-all ${
              !isPaused ? 'w-full duration-[5000ms] ease-linear' : 'w-0'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
          
          {/* Left: Big Feature Photo */}
          <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-slate-900 overflow-hidden">
            <img
              src={currentPost.photoUrl || currentShop?.photoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'}
              alt={currentPost.title}
              className="w-full h-full object-cover transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent"></div>

            {/* Offer banner */}
            {currentPost.offer && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1.5">
                <Tag size={13} />
                <span>धमाका ऑफर: {currentPost.offer}</span>
              </div>
            )}

            {/* Like Counter Badge */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
              <span className="bg-rose-600/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black shadow-md flex items-center space-x-1.5">
                <Heart size={14} className="fill-white" />
                <span>{currentPost.likesCount || 0} लाइक्स (सर्वाधिक पसंद)</span>
              </span>
              <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 flex items-center space-x-1">
                <Star size={13} className="fill-amber-300" />
                <span>4.9 रेटिंग</span>
              </span>
            </div>
          </div>

          {/* Right: Content & Direct Actions */}
          <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Shop Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div 
                  onClick={() => currentShop && onSelectShop(currentShop)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <img
                    src={currentPost.shopLogo || currentShop?.logoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80'}
                    alt={currentPost.shopName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                  />
                  <div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition flex items-center space-x-1.5">
                      <span>{currentPost.shopName}</span>
                      <ShieldCheck size={16} className="text-emerald-600" />
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      Posted by {currentPost.shopName} • {currentPost.shopArea || 'रावला मंडी'}
                    </div>
                  </div>
                </div>

                {/* Save bookmark */}
                <button
                  onClick={() => {
                    if (!currentUser) onOpenAuth();
                    else toggleSavePost(currentPost.id);
                  }}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    isSaved ? 'bg-rose-50 text-rose-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={isSaved ? 'सेव है' : 'सेव करें'}
                >
                  <Bookmark size={18} className={isSaved ? 'fill-rose-600' : ''} />
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {currentPost.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line line-clamp-4">
                  {currentPost.description}
                </p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={(e) => handleCall(e, currentPost)}
                  className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  <Phone size={15} className="text-blue-600" />
                  <span>{systemSettings.callButtonText || 'दुकान पर कॉल करें'}</span>
                </button>
                <button
                  onClick={(e) => handleWhatsApp(e, currentPost)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <MessageCircle size={15} />
                  <span>{systemSettings.whatsappButtonText || 'व्हाट्सएप पूछताछ'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => likePost(currentPost.id)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Heart size={14} className="fill-rose-600" />
                    <span>लाइक ({currentPost.likesCount || 0})</span>
                  </button>
                  <button
                    onClick={() => handleShare(currentPost)}
                    className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    <Share2 size={13} />
                    <span>शेयर</span>
                  </button>
                </div>

                {currentShop && (
                  <button
                    onClick={() => onSelectShop(currentShop)}
                    className="text-xs font-extrabold text-amber-700 hover:text-amber-800 underline flex items-center cursor-pointer"
                  >
                    <span>दुकान का पूरा पेज &gt;</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Progress Dots with 5s Indicator */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {sortedTopPosts.map((post, idx) => (
          <button
            key={post.id}
            onClick={() => {
              setCurrentIndex(idx);
              setProgressKey(prev => prev + 1);
            }}
            className={`transition-all duration-300 cursor-pointer rounded-full ${
              currentIndex === idx 
                ? 'w-8 h-2 bg-rose-600' 
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
            title={`टॉप पोस्ट ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
