import React from 'react';
import { 
  Megaphone, 
  Heart, 
  Bookmark, 
  Share2, 
  Store, 
  Calendar, 
  Tag, 
  MessageCircle, 
  Phone,
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShopPost, Shop } from '../types';

interface PostsFeedProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  filterShopId?: string;
}

export const PostsFeed: React.FC<PostsFeedProps> = ({ 
  onSelectShop, 
  onOpenAuth,
  filterShopId 
}) => {
  const { 
    posts, 
    shops, 
    isPostSaved, 
    toggleSavePost, 
    likePost, 
    currentUser,
    searchQuery,
    selectedCategory 
  } = useApp();

  const activePosts = posts.filter(post => {
    if (post.status !== 'active') return false;
    if (filterShopId && post.shopId !== filterShopId) return false;

    // Category filter
    if (selectedCategory !== 'all' && post.category && post.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchShop = post.shopName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchShop) {
        return false;
      }
    }

    return true;
  });

  const handleSave = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleSavePost(postId);
  };

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

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!filterShopId && (
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-6 bg-orange-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                📢 ताज़ा पोस्ट्स व दैनिक ऑफर्स (Latest Shop Posts)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              रावला मंडी के दुकानदारों द्वारा जारी की गई नई घोषणाएं, स्टॉक अपडेट व डील्स ({activePosts.length} पोस्ट्स)
            </p>
          </div>
        </div>
      )}

      {activePosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 my-6 p-8">
          <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">कोई पोस्ट उपलब्ध नहीं है</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            इस फ़िल्टर के लिए कोई पोस्ट नहीं मिली। दुकानदार अपने डैशबोर्ड से नई पोस्ट जोड़ सकते हैं।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activePosts.map((post) => {
            const saved = isPostSaved(post.id);
            const shop = shops.find(s => s.id === post.shopId);
            const formattedDate = new Date(post.createdAt).toLocaleDateString('hi-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Header: Shop Info */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
                  <div 
                    onClick={() => shop && onSelectShop(shop)}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img 
                        src={post.shopLogo || shop?.logoUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80'} 
                        alt={post.shopName}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition text-sm sm:text-base">
                          {post.shopName}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          सत्यापित
                        </span>
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

                  {/* Bookmark post button */}
                  <button
                    onClick={(e) => handleSave(e, post.id)}
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

                {/* Offer tag if present */}
                {post.offer && (
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 text-xs font-bold flex items-center space-x-1.5">
                    <Tag size={13} />
                    <span>विशेष ऑफर: {post.offer}</span>
                  </div>
                )}

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {post.description}
                  </p>

                  {/* Photo if provided */}
                  {post.photoUrl && post.photoUrl.trim() !== '' && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 max-h-[420px] flex items-center justify-center">
                      <img 
                        src={post.photoUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover max-h-[420px]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Video link notice if provided */}
                  {post.videoUrl && (
                    <div className="mt-2 p-2.5 bg-blue-50 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span>🎥 वीडियो लिंक उपलब्ध है</span>
                      <a 
                        href={post.videoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-700 underline font-bold"
                      >
                        वीडियो देखें &gt;
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Like button */}
                    <button
                      onClick={() => likePost(post.id)}
                      className="flex items-center space-x-1.5 text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <Heart size={15} className="text-rose-500 fill-rose-500" />
                      <span>{post.likesCount || 0} पसंद</span>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={() => handleShare(post)}
                      className="flex items-center space-x-1.5 text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                      title="शेयर करें"
                    >
                      <Share2 size={15} className="text-emerald-600" />
                      <span>शेयर</span>
                    </button>
                  </div>

                  {/* Visit shop channel CTA */}
                  {shop && (
                    <button
                      onClick={() => onSelectShop(shop)}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/60 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      <Store size={14} className="mr-1" />
                      <span>दुकान देखें &gt;</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
