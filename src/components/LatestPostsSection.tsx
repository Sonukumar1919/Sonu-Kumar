import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Tag, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Heart, 
  Bookmark, 
  Share2, 
  Store, 
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopPost, Shop } from '../types';

interface LatestPostsSectionProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
}

export const LatestPostsSection: React.FC<LatestPostsSectionProps> = ({ 
  onSelectShop, 
  onOpenAuth 
}) => {
  const { 
    posts, 
    shops, 
    likePost, 
    toggleSavePost, 
    isPostSaved, 
    currentUser,
    setActiveTab 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'offers_only'>('all');

  // Filter only active posts
  const activePosts = posts.filter(p => {
    if (p.status !== 'active') return false;
    if (activeFilter === 'offers_only' && !p.offer) return false;
    return true;
  });

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

  const handleWhatsAppContact = (e: React.MouseEvent, post: ShopPost) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === post.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मैंने RAWLA MANDI मुख्य पृष्ठ पर आपकी यह पोस्ट देखी: "${post.title}". मुझे इसके बारे में जानकारी चाहिए।`
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>🔴 LIVE ताज़ा अपडेट्स</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            📢 आज की ताज़ा पोस्ट्स व दैनिक ऑफर्स
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 font-medium mt-1">
            रावला मंडी की दुकानों से सीधा लाइव अपडेट — नया स्टॉक, स्पेशल डिस्काउंट और ताजा घोषणाएं
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto bg-black/20 p-1.5 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-white text-orange-700 shadow-sm' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            सभी पोस्ट्स ({posts.filter(p => p.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveFilter('offers_only')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
              activeFilter === 'offers_only' 
                ? 'bg-white text-orange-700 shadow-sm' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Tag size={13} />
            <span>केवल स्पेशल ऑफर्स</span>
          </button>
        </div>
      </div>

      {/* Posts Cards Grid */}
      {activePosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <Megaphone size={36} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">अभी कोई ताज़ा पोस्ट उपलब्ध नहीं है</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePosts.slice(0, 6).map((post) => {
            const shop = shops.find(s => s.id === post.shopId);
            const saved = isPostSaved(post.id);
            const formattedDate = new Date(post.createdAt).toLocaleDateString('hi-IN', {
              day: 'numeric',
              month: 'short'
            });

            return (
              <div
                key={post.id}
                className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-orange-300"
              >
                <div>
                  {/* Shop Identity Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div 
                      onClick={() => shop && onSelectShop(shop)}
                      className="flex items-center space-x-2.5 cursor-pointer group-hover:text-amber-600 transition truncate"
                    >
                      <img
                        src={post.shopLogo || shop?.logoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80'}
                        alt={post.shopName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 truncate flex items-center space-x-1">
                          <span className="truncate">{post.shopName}</span>
                          <span className="text-amber-500 font-extrabold text-[10px]">✓</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Posted by {post.shopName} • {formattedDate}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentUser) onOpenAuth();
                        else toggleSavePost(post.id);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        saved ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={saved ? 'सेव है' : 'सेव करें'}
                    >
                      <Bookmark size={16} className={saved ? 'fill-amber-600' : ''} />
                    </button>
                  </div>

                  {/* Special Offer Pill if present */}
                  {post.offer && (
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                      <Tag size={13} />
                      <span className="truncate">ऑफर: {post.offer}</span>
                    </div>
                  )}

                  {/* Post Image */}
                  {post.photoUrl && (
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={post.photoUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Post Title & Description */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-orange-700 transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => likePost(post.id)}
                      className="flex items-center space-x-1 text-slate-600 hover:text-rose-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                    >
                      <Heart size={13} className="text-rose-500 fill-rose-500" />
                      <span>{post.likesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => handleShare(post)}
                      className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 rounded-lg text-xs"
                      title="शेयर करें"
                    >
                      <Share2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={(e) => handleCall(e, post)}
                      className="p-1.5 bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="दुकानदार को कॉल करें"
                    >
                      <Phone size={14} />
                    </button>
                    <button
                      onClick={(e) => handleWhatsAppContact(e, post)}
                      className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs"
                      title="व्हाट्सएप पर बात करें"
                    >
                      <MessageCircle size={13} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View All Posts Button */}
      {activePosts.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveTab('posts');
            }}
            className="inline-flex items-center space-x-2 bg-white hover:bg-orange-50 border-2 border-orange-500 text-orange-700 font-extrabold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>रावला मंडी की सभी ताज़ा पोस्ट्स देखें ({posts.length})</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};
