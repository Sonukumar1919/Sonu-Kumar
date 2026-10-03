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
import { InstagramHomeFeed } from './components/InstagramHomeFeed';
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
          /* Clean Instagram-Style Homepage: 1. सूचना (Status/Stories Bar) + 2. Products Feed (Swipe Up) */
          <div className="pt-1">
            <InstagramHomeFeed
              onSelectShop={handleSelectShop}
              onOpenAuth={() => setIsAuthOpen(true)}
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
