export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  role: UserRole;
  name: string;
  email?: string;
  shopId?: string; // If shopkeeper
  savedShopIds?: string[];
  savedProductIds?: string[];
  savedPostIds?: string[];
  createdAt: string;
}

export type ShopStatus = 'pending' | 'active' | 'blocked' | 'rejected';

export interface Shop {
  id: string;
  ownerUid: string;
  ownerName: string;
  shopName: string;
  category: string;
  mobileNumber: string;
  whatsappNumber: string;
  email?: string;
  password?: string;
  address: string;
  area: string;
  photoUrl: string;
  logoUrl?: string;
  description: string;
  openingTime: string;
  closingTime: string;
  googleMapLocation?: string;
  status: ShopStatus;
  featured?: boolean;
  rating?: number;
  followersCount?: number;
  createdAt: string;
}

export type ProductCondition = 'new' | 'used' | 'rent';

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  ownerUid: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  photoUrl: string;
  galleryUrls?: string[];
  stockStatus: 'in_stock' | 'out_of_stock';
  condition?: ProductCondition;
  productCode?: string;
  status?: 'active' | 'hidden';
  createdAt: string;
}

export interface ShopPost {
  id: string;
  shopId: string;
  shopName: string;
  shopLogo?: string;
  shopArea?: string;
  shopCategory?: string;
  ownerUid: string;
  title: string;
  description: string;
  photoUrl?: string;
  videoUrl?: string;
  offer?: string;
  category?: string;
  status: 'active' | 'hidden';
  createdAt: string;
  likesCount?: number;
}

export interface AppNotification {
  id: string;
  targetUid: string; // user uid or 'admin' or 'all'
  type: 'shop_registered' | 'shop_approved' | 'shop_rejected' | 'shop_blocked' | 'new_post' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface SiteCustomButton {
  id: string;
  label: string;
  actionType: 'url' | 'whatsapp' | 'call' | 'tab' | 'custom';
  target: string; // url, phone number, or tab name
  position: 'header' | 'feed' | 'floating' | 'footer';
  icon?: string;
  color?: 'amber' | 'emerald' | 'blue' | 'rose' | 'purple' | 'slate';
  enabled: boolean;
}

export interface SystemSettings {
  postApprovalRequired: boolean;
  bannerNotice: string;
  allowRegistrations: boolean;
  // Customizable Site Branding & Texts
  siteName: string;
  siteNameHighlight: string;
  siteTagline: string;
  badgeText: string;
  tickerNotice: string;
  addShopButtonText: string;
  // Bottom Nav Labels
  navHomeText: string;
  navSearchText: string;
  navAreaText: string;
  navUserText: string;
  // Headings & Subtitles
  heroSuperNewTitle: string;
  heroSuperNewSubtitle: string;
  heroTopRatedTitle: string;
  heroTopRatedSubtitle: string;
  heroRemainingTitle: string;
  heroRemainingSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  callButtonText: string;
  whatsappButtonText: string;
  // Additional Action Buttons
  locationButtonText?: string;
  viewChannelButtonText?: string;
  viewProductsButtonText?: string;
  likeButtonText?: string;
  shareButtonText?: string;
  saveButtonText?: string;
  searchButtonText?: string;
  searchPlaceholder?: string;
  // Page & Directory Titles
  heroBadge?: string;
  heroMainTitle?: string;
  heroMainSubtitle?: string;
  shopsListTitle?: string;
  shopsListSubtitle?: string;
  searchPageTitle?: string;
  searchPageSubtitle?: string;
  areaPageTitle?: string;
  areaPageSubtitle?: string;
  userPortalTitle?: string;
  // Dynamic Arbitrary Custom Labels & Button Names
  customLabels?: Record<string, string>;
  // Super Admin Header Announcement & Box Size / Layout Controls
  headerCustomNotice?: string;
  homepageAdminHeading?: string;
  boxSizeScale?: 'compact' | 'normal' | 'spacious' | 'large';
  cardBorderRadius?: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-none';
  themePrimaryColor?: 'amber' | 'emerald' | 'indigo' | 'rose' | 'purple';
  // Super Admin Button Manager: Add, Hide, Edit & Delete buttons
  customButtons?: SiteCustomButton[];
  hiddenButtonKeys?: string[];
}

export interface UserFeedback {
  id: string;
  name: string;
  phoneNumber?: string;
  role: 'customer' | 'shopkeeper';
  shopName?: string;
  message: string;
  rating?: number;
  status: 'new' | 'reviewed';
  createdAt: string;
}

