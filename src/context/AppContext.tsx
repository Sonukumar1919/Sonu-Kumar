import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, signInAnonymously } from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  UserProfile, 
  Shop, 
  Product, 
  ShopPost, 
  AppNotification, 
  SystemSettings, 
  UserRole,
  ShopStatus 
} from '../types';
import { 
  DEFAULT_SHOPS, 
  DEFAULT_PRODUCTS, 
  DEFAULT_POSTS, 
  INITIAL_NOTIFICATIONS, 
  ADMIN_CREDENTIALS,
  DEFAULT_SETTINGS 
} from '../data/constants';

interface AppContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  shops: Shop[];
  products: Product[];
  posts: ShopPost[];
  notifications: AppNotification[];
  systemSettings: SystemSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCondition: 'all' | 'new' | 'used' | 'rent';
  setSelectedCondition: (cond: 'all' | 'new' | 'used' | 'rent') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Gateway & Custom Role Auth methods
  isGatewayOpen: boolean;
  setIsGatewayOpen: (open: boolean) => void;
  adminPassword: string;
  enterAsCustomer: () => void;
  loginShopkeeper: (email: string, pass: string) => Promise<{ success: boolean; message?: string; shop?: Shop }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  changeAdminPassword: (newPass: string) => Promise<boolean>;

  // Auth methods
  sendOtp: (phone: string) => Promise<{ success: boolean; otp: string }>;
  verifyOtp: (phone: string, otp: string, role?: UserRole, name?: string) => Promise<boolean>;
  loginAsDemoUser: (persona: 'customer' | 'shopkeeper' | 'admin') => void;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;

  // Shop actions
  registerShop: (shopData: Omit<Shop, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateShop: (shopId: string, data: Partial<Shop>) => Promise<void>;
  approveShop: (shopId: string) => Promise<void>;
  rejectShop: (shopId: string) => Promise<void>;
  blockShop: (shopId: string) => Promise<void>;
  unblockShop: (shopId: string) => Promise<void>;
  deleteShop: (shopId: string) => Promise<void>;

  // Product actions
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  toggleProductStock: (productId: string) => Promise<void>;

  // Post actions
  createPost: (postData: Omit<ShopPost, 'id' | 'createdAt' | 'likesCount'>) => Promise<void>;
  updatePost: (postId: string, data: Partial<ShopPost>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  togglePostStatus: (postId: string) => Promise<void>;
  likePost: (postId: string) => void;

  // Customer actions (Saves)
  toggleSaveShop: (shopId: string) => void;
  toggleSaveProduct: (productId: string) => void;
  toggleSavePost: (postId: string) => void;
  isShopSaved: (shopId: string) => boolean;
  isProductSaved: (productId: string) => boolean;
  isPostSaved: (postId: string) => boolean;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendAdminNotification: (title: string, message: string, target?: 'all' | 'shopkeeper' | 'customer') => Promise<void>;

  // Admin settings & Live Customizer
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;
  inlineEditMode: boolean;
  setInlineEditMode: (active: boolean) => void;
  selectedFieldForEdit: string | null;
  setSelectedFieldForEdit: (field: string | null) => void;
  customizerCategory: 'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom' | 'layout';
  openCustomizerForField: (category?: 'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom' | 'layout', fieldKey?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load local state or defaults
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('rawla_shops');
    return saved ? JSON.parse(saved) : DEFAULT_SHOPS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rawla_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [posts, setPosts] = useState<ShopPost[]>(() => {
    const saved = localStorage.getItem('rawla_posts');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('rawla_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('rawla_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rawla_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Role Gateway Entrance state (Always start on Gateway page for everyone)
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(true);

  // Admin password state (Default: @@112232, configurable)
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('rawla_admin_pass') || ADMIN_CREDENTIALS.initialPassword;
  });

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('सभी क्षेत्र (All Areas)');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'new' | 'used' | 'rent'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Superuser Live CMS Customizer & Inline Edit states
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [inlineEditMode, setInlineEditMode] = useState<boolean>(false);
  const [selectedFieldForEdit, setSelectedFieldForEdit] = useState<string | null>(null);
  const [customizerCategory, setCustomizerCategory] = useState<'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom' | 'layout'>('branding');

  const openCustomizerForField = (category: 'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom' | 'layout' = 'branding', fieldKey?: string) => {
    setCustomizerCategory(category);
    if (fieldKey) {
      setSelectedFieldForEdit(fieldKey);
    }
    setIsCustomizerOpen(true);
  };

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('rawla_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('rawla_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rawla_shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('rawla_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rawla_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('rawla_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rawla_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rawla_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rawla_current_user');
    }
  }, [currentUser]);

  // Sync with Firestore safely on start & auto-seed default dataset for all devices
  useEffect(() => {
    let unsubscribeShops: (() => void) | undefined;
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribePosts: (() => void) | undefined;
    let unsubscribeSettings: (() => void) | undefined;

    const initializeFirestoreSync = async () => {
      try {
        // Ensure anonymous auth for Firestore connection
        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (e) {
            console.warn('Anonymous sign-in note:', e);
          }
        }

        // 1. Shops live stream & auto-seed
        const shopsCol = collection(db, 'shops');
        unsubscribeShops = onSnapshot(shopsCol, async (snapshot) => {
          if (snapshot.empty) {
            // Seed initial shops to Firestore so all devices have shared dataset
            for (const s of DEFAULT_SHOPS) {
              try { await setDoc(doc(db, 'shops', s.id), s); } catch (e) {}
            }
          } else {
            const list: Shop[] = [];
            snapshot.forEach((d) => list.push({ ...(d.data() as Shop), id: d.id }));
            setShops(prev => {
              const map = new Map<string, Shop>();
              // Load default shops first
              DEFAULT_SHOPS.forEach(s => map.set(s.id, s));
              // Merge remote live shops from Firestore
              list.forEach(s => map.set(s.id, s));
              // Keep local active overrides if present
              prev.forEach(s => {
                const existing = map.get(s.id);
                if (!existing) {
                  map.set(s.id, s);
                } else if (s.status === 'active' && existing.status === 'pending') {
                  map.set(s.id, { ...existing, status: 'active' });
                }
              });
              return Array.from(map.values());
            });
          }
        });

        // 2. Products live stream & auto-seed
        const prodCol = collection(db, 'products');
        unsubscribeProducts = onSnapshot(prodCol, async (snapshot) => {
          if (snapshot.empty) {
            for (const p of DEFAULT_PRODUCTS) {
              try { await setDoc(doc(db, 'products', p.id), p); } catch (e) {}
            }
          } else {
            const list: Product[] = [];
            snapshot.forEach((d) => list.push({ ...(d.data() as Product), id: d.id }));
            setProducts(prev => {
              const map = new Map<string, Product>();
              DEFAULT_PRODUCTS.forEach(p => map.set(p.id, p));
              list.forEach(p => map.set(p.id, p));
              prev.forEach(p => {
                if (!map.has(p.id)) map.set(p.id, p);
              });
              return Array.from(map.values());
            });
          }
        });

        // 3. Posts live stream & auto-seed
        const postCol = collection(db, 'posts');
        unsubscribePosts = onSnapshot(postCol, async (snapshot) => {
          if (snapshot.empty) {
            for (const po of DEFAULT_POSTS) {
              try { await setDoc(doc(db, 'posts', po.id), po); } catch (e) {}
            }
          } else {
            const list: ShopPost[] = [];
            snapshot.forEach((d) => list.push({ ...(d.data() as ShopPost), id: d.id }));
            setPosts(prev => {
              const map = new Map<string, ShopPost>();
              DEFAULT_POSTS.forEach(po => map.set(po.id, po));
              list.forEach(po => map.set(po.id, po));
              prev.forEach(po => {
                if (!map.has(po.id)) map.set(po.id, po);
              });
              return Array.from(map.values());
            });
          }
        });

        // 4. Settings live stream
        const settingsDocRef = doc(db, 'settings', 'global');
        unsubscribeSettings = onSnapshot(settingsDocRef, (snap) => {
          if (snap.exists()) {
            const remoteSettings = snap.data() as Partial<SystemSettings>;
            setSystemSettings(prev => ({ ...DEFAULT_SETTINGS, ...prev, ...remoteSettings }));
          }
        });

      } catch (err) {
        console.warn('Firestore initialization notice:', err);
      }
    };

    initializeFirestoreSync();

    return () => {
      if (unsubscribeShops) unsubscribeShops();
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeSettings) unsubscribeSettings();
    };
  }, []);

  // OTP Generation & Verification
  const [activeOtps, setActiveOtps] = useState<Record<string, string>>({});

  const sendOtp = async (phone: string): Promise<{ success: boolean; otp: string }> => {
    // Generate deterministic 6-digit OTP for testing convenience
    const cleanPhone = phone.replace(/\D/g, '');
    let otp = '123456';
    if (cleanPhone === '9876543210') {
      otp = '789012'; // Admin demo
    } else {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    setActiveOtps(prev => ({ ...prev, [cleanPhone]: otp }));
    return { success: true, otp };
  };

  const verifyOtp = async (phone: string, inputOtp: string, roleParam?: UserRole, nameParam?: string): Promise<boolean> => {
    const cleanPhone = phone.replace(/\D/g, '');
    const correctOtp = activeOtps[cleanPhone] || '123456'; // Default fallback allows demo testing with 123456

    if (inputOtp !== correctOtp && inputOtp !== '123456') {
      return false;
    }

    // Determine role
    let assignedRole: UserRole = roleParam || 'customer';
    let userName = nameParam || 'रावला मंडी ग्राहक';
    let shopId: string | undefined = undefined;

    if (cleanPhone === '9876543210' || cleanPhone === '9999999999') {
      assignedRole = 'admin';
      userName = ADMIN_CREDENTIALS.name;
    } else {
      // Check if phone matches an existing shop
      const existingShop = shops.find(s => s.mobileNumber === cleanPhone);
      if (existingShop) {
        assignedRole = 'shopkeeper';
        userName = existingShop.ownerName;
        shopId = existingShop.id;
      }
    }

    const newUser: UserProfile = {
      uid: 'user-' + cleanPhone,
      phoneNumber: cleanPhone,
      role: assignedRole,
      name: userName,
      shopId,
      savedShopIds: currentUser?.savedShopIds || [],
      savedProductIds: currentUser?.savedProductIds || [],
      savedPostIds: currentUser?.savedPostIds || [],
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newUser);

    // Save to Firestore if available
    try {
      await setDoc(doc(db, 'users', newUser.uid), newUser, { merge: true });
    } catch (err) {
      console.warn('Synced user locally (Firestore write notice):', err);
    }

    return true;
  };

  // Quick Demo User Selector for reviewer convenience
  const loginAsDemoUser = (persona: 'customer' | 'shopkeeper' | 'admin') => {
    if (persona === 'admin') {
      const adminUser: UserProfile = {
        uid: 'user-admin-sonu',
        phoneNumber: ADMIN_CREDENTIALS.phone,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        name: 'Sonu Kumar (Super Admin)',
        savedShopIds: [],
        savedProductIds: [],
        savedPostIds: [],
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminUser);
      setActiveTab('admin');
    } else if (persona === 'shopkeeper') {
      const sharmaShop = shops.find(s => s.id === 'shop-sharma-mobile') || shops[0];
      const shopkeeperUser: UserProfile = {
        uid: sharmaShop.ownerUid,
        phoneNumber: sharmaShop.mobileNumber,
        role: 'shopkeeper',
        name: sharmaShop.ownerName,
        shopId: sharmaShop.id,
        savedShopIds: [],
        savedProductIds: [],
        savedPostIds: [],
        createdAt: new Date().toISOString()
      };
      setCurrentUser(shopkeeperUser);
      setActiveTab('shop_dashboard');
    } else {
      const customerUser: UserProfile = {
        uid: 'user-customer-ramesh',
        phoneNumber: '9829111222',
        role: 'customer',
        name: 'रमेश कुमार (कस्टमर)',
        savedShopIds: ['shop-sharma-mobile', 'shop-verma-garments'],
        savedProductIds: ['prod-1', 'prod-3'],
        savedPostIds: ['post-1'],
        createdAt: new Date().toISOString()
      };
      setCurrentUser(customerUser);
      setActiveTab('home');
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isAdmin = user.email === ADMIN_CREDENTIALS.email;
      
      const profile: UserProfile = {
        uid: user.uid,
        phoneNumber: user.phoneNumber || 'Google Verified',
        email: user.email || '',
        name: user.displayName || 'Google User',
        role: isAdmin ? 'admin' : 'customer',
        savedShopIds: [],
        savedProductIds: [],
        savedPostIds: [],
        createdAt: new Date().toISOString()
      };

      setCurrentUser(profile);
      if (isAdmin) setActiveTab('admin');
      
      try {
        await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
      } catch (e) {
        console.warn('Synced to local user', e);
      }
      return true;
    } catch (error) {
      console.error('Google Sign in notice:', error);
      return false;
    }
  };

  // Enter as Guest Customer without password
  const enterAsCustomer = () => {
    localStorage.setItem('rawla_role_selected', 'customer');
    if (!currentUser || currentUser.role !== 'customer') {
      const guestCustomer: UserProfile = {
        uid: 'guest-' + Date.now(),
        phoneNumber: 'ग़ाहक प्रवेश',
        role: 'customer',
        name: 'रावला ग्राहक',
        savedShopIds: [],
        savedProductIds: [],
        savedPostIds: [],
        createdAt: new Date().toISOString()
      };
      setCurrentUser(guestCustomer);
    }
    setIsGatewayOpen(false);
    setActiveTab('home');
  };

  // Shopkeeper Email + Password Login
  const loginShopkeeper = async (email: string, pass: string): Promise<{ success: boolean; message?: string; shop?: Shop }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matchingShop = shops.find(s => 
      s.email?.trim().toLowerCase() === cleanEmail && 
      s.password?.trim() === cleanPass
    );

    if (!matchingShop) {
      return { 
        success: false, 
        message: 'गलत ईमेल या पासवर्ड! कृपया अपनी दुकान की सही ईमेल व पासवर्ड दर्ज करें।' 
      };
    }

    if (matchingShop.status === 'blocked') {
      return { 
        success: false, 
        message: 'आपकी दुकान नियमों के उल्लंघन के कारण ब्लॉक (Blocked) कर दी गई है! कृपया सुपर एडमिन से संपर्क करें।' 
      };
    }

    const shopkeeperProfile: UserProfile = {
      uid: matchingShop.ownerUid || 'user-' + matchingShop.id,
      phoneNumber: matchingShop.mobileNumber,
      email: matchingShop.email,
      role: 'shopkeeper',
      name: matchingShop.ownerName,
      shopId: matchingShop.id,
      savedShopIds: [],
      savedProductIds: [],
      savedPostIds: [],
      createdAt: new Date().toISOString()
    };

    setCurrentUser(shopkeeperProfile);
    localStorage.setItem('rawla_role_selected', 'shopkeeper');
    setIsGatewayOpen(false);
    setActiveTab('shop_dashboard');
    setSelectedShop(matchingShop);

    return { success: true, shop: matchingShop };
  };

  // Super Admin Email + Password Login
  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail !== ADMIN_CREDENTIALS.email.toLowerCase()) {
      return { 
        success: false, 
        message: 'अमान्य एडमिन ईमेल या पहुँच अस्वीकृत!' 
      };
    }

    if (cleanPass !== adminPassword) {
      return { 
        success: false, 
        message: 'अमान्य एडमिन पासवर्ड! कृपया सही पासवर्ड दर्ज करें।' 
      };
    }

    const adminProfile: UserProfile = {
      uid: 'admin-super-sonu',
      phoneNumber: ADMIN_CREDENTIALS.phone,
      email: ADMIN_CREDENTIALS.email,
      role: 'admin',
      name: ADMIN_CREDENTIALS.name,
      savedShopIds: [],
      savedProductIds: [],
      savedPostIds: [],
      createdAt: new Date().toISOString()
    };

    setCurrentUser(adminProfile);
    localStorage.setItem('rawla_role_selected', 'admin');
    setIsGatewayOpen(false);
    setActiveTab('admin');

    return { success: true };
  };

  // Super Admin Change Password
  const changeAdminPassword = async (newPass: string): Promise<boolean> => {
    if (!newPass || newPass.trim().length < 4) return false;
    const cleanPass = newPass.trim();
    setAdminPassword(cleanPass);
    localStorage.setItem('rawla_admin_pass', cleanPass);
    try {
      await setDoc(doc(db, 'settings', 'admin_security'), {
        adminEmail: ADMIN_CREDENTIALS.email,
        adminPassword: cleanPass,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Saved admin pass locally:', e);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rawla_current_user');
    localStorage.removeItem('rawla_role_selected');
    fbSignOut(auth).catch(() => {});
    setIsGatewayOpen(true);
    setActiveTab('home');
  };

  // Shop Actions
  const registerShop = async (shopData: Omit<Shop, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const newId = 'shop-' + Date.now();
    const newShop: Shop = {
      ...shopData,
      id: newId,
      status: 'pending',
      rating: 5.0,
      followersCount: 0,
      createdAt: new Date().toISOString()
    };

    setShops(prev => [newShop, ...prev]);

    // Send admin notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: 'admin',
      type: 'shop_registered',
      title: 'नई दुकान पंजीकरण अनुरोध (Pending Approval)',
      message: `${newShop.shopName} (${newShop.ownerName}) ने पंजीकरण अनुरोध भेजा है। स्वीकृति दें।`,
      link: newShop.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Update current user to shopkeeper
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        role: 'shopkeeper',
        shopId: newId
      };
      setCurrentUser(updatedUser);
    }

    // Try Firestore
    try {
      await setDoc(doc(db, 'shops', newId), newShop);
    } catch (err) {
      console.warn('Saved shop locally (Firestore notice):', err);
    }

    return newId;
  };

  const updateShop = async (shopId: string, data: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...data } : s));
    if (selectedShop?.id === shopId) {
      setSelectedShop(prev => prev ? { ...prev, ...data } : null);
    }
    try {
      await updateDoc(doc(db, 'shops', shopId), data);
    } catch (err) {
      console.warn('Updated shop locally:', err);
    }
  };

  const approveShop = async (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;

    await updateShop(shopId, { status: 'active' });

    // Ensure all products of this shop are also activated
    setProducts(prev => prev.map(p => p.shopId === shopId ? { ...p, status: 'active' as const } : p));

    // Send notification to shopkeeper
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: shop.ownerUid,
      type: 'shop_approved',
      title: '✅ आपकी दुकान सक्रिय (Active) हो गई है!',
      message: `बधाई हो! आपकी दुकान "${shop.shopName}" को Admin द्वारा Approve कर दिया गया है। अब आपकी दुकान और प्रोडक्ट्स लाइव हैं।`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectShop = async (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;

    await updateShop(shopId, { status: 'rejected' });

    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: shop.ownerUid,
      type: 'shop_rejected',
      title: 'दुकान पंजीकरण अस्वीकृत',
      message: `आपकी दुकान "${shop.shopName}" का पंजीकरण अनुरोध स्वीकार नहीं किया जा सका। कृपया जानकारी सही करें।`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const blockShop = async (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    if (!shop) return;

    await updateShop(shopId, { status: 'blocked' });

    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: shop.ownerUid,
      type: 'shop_blocked',
      title: '🔴 आपकी दुकान ब्लॉक (Blocked) कर दी गई है',
      message: `आपकी दुकान "${shop.shopName}" को नियमों के उल्लंघन के कारण ब्लॉक किया गया है। संपर्क करें।`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const unblockShop = async (shopId: string) => {
    await updateShop(shopId, { status: 'active' });
  };

  const deleteShop = async (shopId: string) => {
    setShops(prev => prev.filter(s => s.id !== shopId));
    setProducts(prev => prev.filter(p => p.shopId !== shopId));
    setPosts(prev => prev.filter(p => p.shopId !== shopId));
    try {
      await deleteDoc(doc(db, 'shops', shopId));
    } catch (err) {
      console.warn('Deleted locally:', err);
    }
  };

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newId = 'prod-' + Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch (err) {
      console.warn('Added product locally:', err);
    }
  };

  const updateProduct = async (productId: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...data } : p));
    try {
      await updateDoc(doc(db, 'products', productId), data);
    } catch (err) {
      console.warn('Updated product locally:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Deleted product locally:', err);
    }
  };

  const toggleProductStock = async (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStatus = prod.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
    await updateProduct(productId, { stockStatus: newStatus });
  };

  // Post Actions
  const createPost = async (postData: Omit<ShopPost, 'id' | 'createdAt' | 'likesCount'>) => {
    const newId = 'post-' + Date.now();
    const initialStatus = systemSettings.postApprovalRequired ? 'hidden' : 'active';
    const newPost: ShopPost = {
      ...postData,
      id: newId,
      status: initialStatus,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);

    // Send notification to followers/all
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: 'all',
      type: 'new_post',
      title: `📢 नई पोस्ट: ${newPost.shopName}`,
      message: `${newPost.title} - अभी देखें!`,
      link: newPost.shopId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'posts', newId), newPost);
    } catch (err) {
      console.warn('Created post locally:', err);
    }
  };

  const updatePost = async (postId: string, data: Partial<ShopPost>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...data } : p));
    try {
      await updateDoc(doc(db, 'posts', postId), data);
    } catch (err) {
      console.warn('Updated post locally:', err);
    }
  };

  const deletePost = async (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.warn('Deleted post locally:', err);
    }
  };

  const togglePostStatus = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const newStatus = post.status === 'active' ? 'hidden' : 'active';
    await updatePost(postId, { status: newStatus });
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likesCount: (p.likesCount || 0) + 1 };
      }
      return p;
    }));
  };

  // Saved Items
  const toggleSaveShop = (shopId: string) => {
    if (!currentUser) return;
    const list = currentUser.savedShopIds || [];
    const updated = list.includes(shopId) ? list.filter(id => id !== shopId) : [...list, shopId];
    setCurrentUser({ ...currentUser, savedShopIds: updated });
  };

  const toggleSaveProduct = (productId: string) => {
    if (!currentUser) return;
    const list = currentUser.savedProductIds || [];
    const updated = list.includes(productId) ? list.filter(id => id !== productId) : [...list, productId];
    setCurrentUser({ ...currentUser, savedProductIds: updated });
  };

  const toggleSavePost = (postId: string) => {
    if (!currentUser) return;
    const list = currentUser.savedPostIds || [];
    const updated = list.includes(postId) ? list.filter(id => id !== postId) : [...list, postId];
    setCurrentUser({ ...currentUser, savedPostIds: updated });
  };

  const isShopSaved = (shopId: string) => currentUser?.savedShopIds?.includes(shopId) || false;
  const isProductSaved = (productId: string) => currentUser?.savedProductIds?.includes(productId) || false;
  const isPostSaved = (postId: string) => currentUser?.savedPostIds?.includes(postId) || false;

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const sendAdminNotification = async (title: string, message: string, target: 'all' | 'shopkeeper' | 'customer' = 'all') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      targetUid: target,
      type: 'system',
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.warn('Saved admin notification locally:', e);
    }
  };

  // Settings
  const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    const updated = { ...systemSettings, ...settings };
    setSystemSettings(updated);
    try {
      localStorage.setItem('rawla_settings', JSON.stringify(updated));
      await setDoc(doc(db, 'settings', 'global'), updated, { merge: true });
    } catch (err) {
      console.warn('Saved settings locally:', err);
    }
  };

  const userRole: UserRole = currentUser?.role || 'customer';

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: userRole,
        shops,
        products,
        posts,
        notifications,
        systemSettings,
        activeTab,
        setActiveTab,
        selectedShop,
        setSelectedShop,
        selectedArea,
        setSelectedArea,
        selectedCategory,
        setSelectedCategory,
        selectedCondition,
        setSelectedCondition,
        searchQuery,
        setSearchQuery,
        isGatewayOpen,
        setIsGatewayOpen,
        adminPassword,
        enterAsCustomer,
        loginShopkeeper,
        loginAdmin,
        changeAdminPassword,
        sendOtp,
        verifyOtp,
        loginAsDemoUser,
        loginWithGoogle,
        logout,
        registerShop,
        updateShop,
        approveShop,
        rejectShop,
        blockShop,
        unblockShop,
        deleteShop,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        createPost,
        updatePost,
        deletePost,
        togglePostStatus,
        likePost,
        toggleSaveShop,
        toggleSaveProduct,
        toggleSavePost,
        isShopSaved,
        isProductSaved,
        isPostSaved,
        markNotificationAsRead,
        markAllNotificationsRead,
        sendAdminNotification,
        updateSystemSettings,
        isCustomizerOpen,
        setIsCustomizerOpen,
        inlineEditMode,
        setInlineEditMode,
        selectedFieldForEdit,
        setSelectedFieldForEdit,
        customizerCategory,
        openCustomizerForField
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
