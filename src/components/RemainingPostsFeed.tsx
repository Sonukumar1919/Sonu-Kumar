import React from 'react';
import { 
  Megaphone, 
  Heart, 
  Bookmark, 
  Share2, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Store, 
  ShieldCheck, 
  Tag, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopPost, Shop } from '../types';

interface RemainingPostsFeedProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  excludePostIds?: string[];
}

export const RemainingPostsFeed: React.FC<RemainingPostsFeedProps> = ({ 
  onSelectShop, 
  onOpenAuth,
  excludePostIds = [] 
}) => {
  const { posts, shops, likePost, toggleSavePost, isPostSaved, currentUser, systemSettings } = useApp();

  // All active posts that are remaining (or all active posts if few)
  let remainingPosts = posts.filter(p => p.status === 'active' && !excludePostIds.includes(p.id));

  // If there are very few posts in total, include all active posts so the user has plenty to browse
  if (remainingPosts.length === 0) {
    remainingPosts = posts.filter(p => p.status === 'active');
  }

  const handleShare = (post: ShopPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.title} - ${post.shopName} (Rawla Mandi)`,
        url: window.location.href
      }).catch(() => {});
    } else {
      const text = encodeURIComponent(`📢 ${post.title}\nदुकान: ${post.shopName} (रावला मंडी)\n${post.description}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const handleWhatsApp = (e: React.MouseEvent, post: ShopPost) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === post.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI पर आपकी पोस्ट "${post.title}" देखी है। मुझे अधिक जानकारी चाहिए।`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent, post: ShopPost) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === post.shopId);
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-6 bg-amber-600 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {systemSettings.heroRemainingTitle || '📰 अन्य सभी ताज़ा पोस्ट्स (All Latest Market Posts)'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {systemSettings.heroRemainingSubtitle || 'रावला मंडी के व्यापारियों की सभी पोस्ट्स व घोषणाएं — एक के नीचे एक (All Posts Feed)'}
          </p>
        </div>

        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          {remainingPosts.length} पोस्ट्स
        </span>
      </div>

      {/* Vertical Stacking: One below another (ak k niche ak) */}
      <div className="space-y-6">
        {remainingPosts.map((post) => {
          const shop = shops.find(s => s.id === post.shopId);
          const saved = isPostSaved(post.id);
          const formattedDate = new Date(post.createdAt).toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Header: Shop Info */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                <div 
                  onClick={() => shop && onSelectShop(shop)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <img
                    src={post.shopLogo || shop?.logoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80'}
                    alt={post.shopName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-slate-900 group-hover:text-amber-600 transition text-sm sm:text-base">
                        {post.shopName}
                      </span>
                      <ShieldCheck size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                      <span>Posted by {post.shopName}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar size={11} className="mr-1 text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bookmark post */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentUser) onOpenAuth();
                    else toggleSavePost(post.id);
                  }}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    saved 
                      ? 'bg-amber-500 text-white' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title={saved ? 'पोस्ट सेव है' : 'पोस्ट सेव करें'}
                >
                  <Bookmark size={18} className={saved ? 'fill-white' : ''} />
                </button>
              </div>

              {/* Offer Tag */}
              {post.offer && (
                <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-5 py-2 text-xs font-black flex items-center space-x-2">
                  <Tag size={14} />
                  <span>विशेष दुकान ऑफर: {post.offer}</span>
                </div>
              )}

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-3.5">
                <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {post.description}
                </p>

                {/* Photo (from gallery / url) */}
                {post.photoUrl && post.photoUrl.trim() !== '' && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 max-h-[460px] flex items-center justify-center">
                    <img 
                      src={post.photoUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover max-h-[460px]"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Footer Actions: Call, WhatsApp, Like, Share */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center space-x-1.5 text-slate-700 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Heart size={15} className="text-rose-500 fill-rose-500" />
                    <span>{post.likesCount || 0} पसंद</span>
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-1.5 text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    title="शेयर करें"
                  >
                    <Share2 size={14} className="text-emerald-600" />
                    <span>शेयर</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleCall(e, post)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    <Phone size={14} className="text-blue-600" />
                    <span>कॉल</span>
                  </button>

                  <button
                    onClick={(e) => handleWhatsApp(e, post)}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>

                  {shop && (
                    <button
                      onClick={() => onSelectShop(shop)}
                      className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <Store size={14} />
                      <span>दुकान देखें &gt;</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
