import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BannerTicker } from './components/BannerTicker';
import { HeroSearch } from './components/HeroSearch';
import { ShopsList } from './components/ShopsList';
import { ProductsGrid } from './components/ProductsGrid';
import { PostsFeed } from './components/PostsFeed';
import { LatestPostsSection } from './components/LatestPostsSection';
import { SuperNewProductsSlider } from './components/SuperNewProductsSlider';
import { TopRatedPostsSlider } from './components/TopRatedPostsSlider';
import { RemainingPostsFeed } from './components/RemainingPostsFeed';
import { SearchAndCategoriesView } from './components/SearchAndCategoriesView';
import { AreaLocationsView } from './components/AreaLocationsView';
import { UserPortalView } from './components/UserPortalView';
import { BottomNav } from './components/BottomNav';
import { ShopChannelView } from './components/ShopChannelView';
import { ShopRegistrationModal } from './components/ShopRegistrationModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ShopkeeperDashboard } from './components/ShopkeeperDashboard';
import { AdminPanel } from './components/AdminPanel';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import { SiteCustomizerModal } from './components/SiteCustomizerModal';
import { RoleGatewayPage } from './components/RoleGatewayPage';
import { Shop } from './types';
import { Store, ShoppingBag, Megaphone, PlusCircle, ArrowRight, ShieldCheck, Sliders, Edit3, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedShop, 
    setSelectedShop, 
    role, 
    shops,
    systemSettings,
    isCustomizerOpen,
    setIsCustomizerOpen,
    inlineEditMode,
    setInlineEditMode,
    openCustomizerForField,
    isGatewayOpen
  } = useApp();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegisterShopOpen, setIsRegisterShopOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [topPostIds, setTopPostIds] = useState<string[]>([]);

  // Show creative role entrance gateway page first if no role chosen or gateway requested
  if (isGatewayOpen) {
    return <RoleGatewayPage />;
  }

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectShopById = (shopId: string) => {
    const s = shops.find(item => item.id === shopId);
    if (s) {
      setSelectedShop(s);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-theme-flow text-slate-900 font-sans transition-all duration-1000">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* Breaking / Notice Ticker */}
      <BannerTicker />

      {/* Main Content Router */}
      <main className="flex-1 pb-20">
        {/* If a shop channel is selected, display its dedicated channel */}
        {selectedShop ? (
          <ShopChannelView
            shop={selectedShop}
            onBack={() => setSelectedShop(null)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : activeTab === 'search_categories' ? (
          /* Button 2: Search & Categories */
          <SearchAndCategoriesView
            onSelectShop={handleSelectShop}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
          />
        ) : activeTab === 'area_locations' ? (
          /* Button 3: Area & Shop Location */
          <AreaLocationsView
            onSelectShop={handleSelectShop}
          />
        ) : activeTab === 'user_portal' ? (
          /* Button 4: User, Saved Products & Shopkeeper Status */
          <UserPortalView
            onSelectShop={handleSelectShop}
            onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : activeTab === 'customer_dashboard' ? (
          <CustomerDashboard
            onSelectShop={handleSelectShop}
            onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
          />
        ) : activeTab === 'shop_dashboard' ? (
          <ShopkeeperDashboard
            onSelectShop={handleSelectShop}
          />
        ) : activeTab === 'admin' ? (
          <AdminPanel
            onSelectShop={handleSelectShop}
          />
        ) : activeTab === 'shops' ? (
          <SearchAndCategoriesView
            onSelectShop={handleSelectShop}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
          />
        ) : activeTab === 'products' ? (
          <div>
            <HeroSearch />
            <ProductsGrid
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        ) : activeTab === 'posts' ? (
          <div>
            <HeroSearch />
            <PostsFeed
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </div>
        ) : (
          /* Default Button 1: Home View (Post feeds, Super new auto-swipe, 5s trending swipe) */
          <div className="space-y-6 pt-2">
            {/* 1. ⚡ सुपर न्यू प्रोडक्ट्स ऑटो-स्वाइप (Super New Products Automatic Swipe Slider) */}
            <SuperNewProductsSlider
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
            />

            {/* 2. 🔥 सर्वाधिक पसंद व रेटिंग वाली पोस्ट्स (5 Second Auto Swipe Slider) */}
            <TopRatedPostsSlider
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
              onTopPostIdsChange={setTopPostIds}
            />

            {/* 3. 📰 अन्य सभी बची हुई पोस्ट्स - एक के नीचे एक (Remaining Posts Stacked Vertically) */}
            <RemainingPostsFeed
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
              excludePostIds={topPostIds}
            />

            {/* Quick CTA Card for Shopkeepers */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Inline Edit Marker */}
                {inlineEditMode && role === 'admin' && (
                  <button
                    onClick={() => openCustomizerForField('headings', 'ctaTitle')}
                    className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-xs font-black flex items-center space-x-1 shadow-md hover:bg-amber-300 cursor-pointer animate-bounce"
                  >
                    <Edit3 size={12} />
                    <span>एडिट CTA कार्ड</span>
                  </button>
                )}

                <div className="space-y-2 text-center md:text-left">
                  <span className="bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    दुकानदारों के लिए सुनहरा अवसर
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-display">
                    {systemSettings.ctaTitle || 'क्या आपकी दुकान रावला मंडी में है?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                    {systemSettings.ctaSubtitle || 'अपनी दुकान को आज ही निःशुल्क RAWLA MANDI पोर्टल पर जोड़ें। गैलरी से फ़ोटो अपलोड करें, डिजिटल चैनल बनाएं, प्रोडक्ट्स जोड़ें और सीधे ग्राहकों से कॉल या व्हाट्सएप पर आर्डर पाएं!'}
                  </p>
                </div>
                <button
                  onClick={() => setIsRegisterShopOpen(true)}
                  className="bg-white hover:bg-emerald-50 text-emerald-900 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold shadow-md transition transform hover:-translate-y-0.5 shrink-0 flex items-center space-x-2 cursor-pointer"
                >
                  <PlusCircle size={18} className="text-emerald-600" />
                  <span>{systemSettings.ctaButtonText || 'अपनी दुकान जोड़ें (Register Free)'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Featured Shops Directory Grid */}
            <ShopsList
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <ShopRegistrationModal
        isOpen={isRegisterShopOpen}
        onClose={() => setIsRegisterShopOpen(false)}
        onSuccess={() => {}}
      />

      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectShopById={handleSelectShopById}
      />

      {/* Superuser Live Name & Button Customizer Modal */}
      <SiteCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenRegisterShop={() => setIsRegisterShopOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Fixed 4-Button Bottom Navigation Bar */}
      <BottomNav
        onOpenAuth={() => setIsAuthOpen(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
