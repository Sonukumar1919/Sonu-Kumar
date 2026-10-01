import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Phone, 
  Store, 
  CheckCircle, 
  XCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Shop } from '../types';

interface ProductsGridProps {
  onSelectShop: (shop: Shop) => void;
  onOpenAuth: () => void;
  filterShopId?: string;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  onSelectShop, 
  onOpenAuth,
  filterShopId 
}) => {
  const { 
    products, 
    shops, 
    selectedCategory, 
    searchQuery, 
    isProductSaved, 
    toggleSaveProduct,
    currentUser 
  } = useApp();

  // Filter products
  const filteredProducts = products.filter(product => {
    // Only products from active shops
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop || shop.status !== 'active') return false;

    if (filterShopId && product.shopId !== filterShopId) {
      return false;
    }

    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchShop = product.shopName.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchShop && !matchCat) {
        return false;
      }
    }

    return true;
  });

  const handleSave = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    toggleSaveProduct(productId);
  };

  const handleProductWhatsApp = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    const cleanNumber = shop.whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `नमस्ते ${shop.shopName}! मुझे आपके प्रोडक्ट "${product.name}" (कीमत: ₹${product.discountPrice || product.price}) के बारे में जानकारी चाहिए। क्या यह स्टॉक में है?`
    );
    window.open(`https://wa.me/91${cleanNumber}?text=${message}`, '_blank');
  };

  const handleProductCall = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) return;
    window.location.href = `tel:${shop.mobileNumber}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!filterShopId && (
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-6 bg-emerald-600 rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                📦 प्रोडक्ट्स व सामान (Marketplace Products)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              रावला मंडी की दुकानों में उपलब्ध ताज़ा सामान व दर सूची ({filteredProducts.length} प्रोडक्ट्स उपलब्ध)
            </p>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 my-6 p-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">कोई प्रोडक्ट नहीं मिला</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            इस श्रेणी या खोज में कोई प्रोडक्ट नहीं मिला। कृपया फ़िल्टर बदलें।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const saved = isProductSaved(product.id);
            const shop = shops.find(s => s.id === product.shopId);
            const discountPercent = product.discountPrice 
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-emerald-300"
              >
                {/* Product Photo */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />

                  {/* Discount percentage tag */}
                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-lg shadow-md">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {/* Stock status badge */}
                  <span className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-md flex items-center space-x-1 shadow-xs ${
                    product.stockStatus === 'in_stock'
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-rose-600/90 text-white'
                  }`}>
                    {product.stockStatus === 'in_stock' ? (
                      <>
                        <CheckCircle size={10} />
                        <span>स्टॉक में उपलब्ध</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={10} />
                        <span>आउट ऑफ़ स्टॉक</span>
                      </>
                    )}
                  </span>

                  {/* Save button */}
                  <button
                    onClick={(e) => handleSave(e, product.id)}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                      saved 
                        ? 'bg-rose-500 text-white shadow-md' 
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                    title={saved ? 'प्रोडक्ट सेव है' : 'प्रोडक्ट सेव करें'}
                  >
                    <Heart size={16} className={saved ? 'fill-white' : ''} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
                        {product.category}
                      </span>
                      {product.productCode && (
                        <span className="text-slate-400">कोड: {product.productCode}</span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1.5 line-clamp-2 leading-snug group-hover:text-emerald-700 transition">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                        ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Shop details & link */}
                    {shop && (
                      <div 
                        onClick={() => onSelectShop(shop)}
                        className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 hover:text-amber-600 cursor-pointer"
                        title="दुकान देखें"
                      >
                        <span className="flex items-center truncate font-medium">
                          <Store size={13} className="text-amber-600 mr-1.5 shrink-0" />
                          <span className="truncate">{shop.shopName}</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                          दुकान देखें &gt;
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inquire Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={(e) => handleProductCall(e, product)}
                      className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      <Phone size={13} className="text-blue-600" />
                      <span>कॉल करें</span>
                    </button>
                    <button
                      onClick={(e) => handleProductWhatsApp(e, product)}
                      className="flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
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
    </section>
  );
};
