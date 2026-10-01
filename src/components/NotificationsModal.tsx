import React from 'react';
import { Bell, CheckCheck, X, Store, Megaphone, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShopById: (shopId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectShopById 
}) => {
  const { 
    notifications, 
    currentUser, 
    role, 
    markNotificationAsRead, 
    markAllNotificationsRead,
    setActiveTab 
  } = useApp();

  if (!isOpen) return null;

  // Filter relevant notifications
  const userNotifications = notifications.filter(n => {
    if (role === 'admin') return true;
    if (n.targetUid === 'all') return true;
    if (currentUser && n.targetUid === currentUser.uid) return true;
    return false;
  });

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      if (notif.type === 'shop_registered' && role === 'admin') {
        setActiveTab('admin');
      } else {
        onSelectShopById(notif.link);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">सूचनाएं (Notifications)</h3>
              <p className="text-[11px] text-slate-400">दुकान अपडेट्स व मंडी संदेश</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[65vh] overflow-y-auto divide-y divide-slate-100">
          {userNotifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              कोई नई सूचना नहीं है।
            </div>
          ) : (
            userNotifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`py-3 px-2 flex items-start space-x-3 cursor-pointer rounded-xl hover:bg-slate-50 transition ${
                  !n.read ? 'bg-amber-50/50' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  {n.type === 'shop_registered' && <Store size={16} className="text-amber-600" />}
                  {n.type === 'shop_approved' && <ShieldCheck size={16} className="text-emerald-600" />}
                  {n.type === 'new_post' && <Megaphone size={16} className="text-orange-600" />}
                  {n.type === 'shop_blocked' && <AlertCircle size={16} className="text-rose-600" />}
                  {n.type === 'system' && <Bell size={16} className="text-blue-600" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ml-2"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString('hi-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {userNotifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
            <button
              onClick={markAllNotificationsRead}
              className="text-amber-700 font-bold hover:underline flex items-center space-x-1"
            >
              <CheckCheck size={14} />
              <span>सभी को पढ़ा हुआ मार्क करें</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
            >
              बंद करें
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
