import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  User, 
  Phone, 
  Store 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'shopkeeper';
}

export const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'customer'
}) => {
  const { currentUser, submitFeedback, shops } = useApp();

  const [role, setRole] = useState<'customer' | 'shopkeeper'>(
    currentUser?.role === 'shopkeeper' ? 'shopkeeper' : defaultRole
  );
  const [name, setName] = useState(currentUser?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phoneNumber || '');
  const [shopName, setShopName] = useState(() => {
    if (currentUser?.shopId) {
      const s = shops.find(item => item.id === currentUser.shopId);
      return s?.shopName || '';
    }
    return '';
  });
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        role,
        shopName: role === 'shopkeeper' ? shopName.trim() : undefined,
        message: message.trim(),
        rating
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-colors">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition text-white cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center space-x-2 mb-1.5">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <MessageSquare size={20} />
            </span>
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              सीधा सुपरएडमिन को संदेश
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display">
            अपनी राय / फीडबैक दें
          </h3>
          <p className="text-xs text-amber-100 font-medium mt-1">
            वेबसाइट निर्माता (SuperAdmin) को अपनी सलाह, सुझाव या शिकायत सीधे भेजें। यह तुरंत लाइव दिखेगी।
          </p>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              धन्यवाद! आपकी राय सुपरएडमिन तक पहुँच गई है
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              आपके सुझाव से रावला मंडी पोर्टल को और भी बेहतर बनाने में मदद मिलेगी।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                आप कौन हैं? (Select Role)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    role === 'customer'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <User size={14} />
                  <span>ग्राहक (Customer)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('shopkeeper')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    role === 'shopkeeper'
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Store size={14} />
                  <span>दुकानदार (Shopkeeper)</span>
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  आपका नाम *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. राहुल बिश्नोई"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  मोबाइल नंबर (वैकल्पिक)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="उदा. 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>
            </div>

            {/* If shopkeeper, ask shop name */}
            {role === 'shopkeeper' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  आपकी दुकान का नाम
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="उदा. शर्मा मोबाइल, रावला"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden"
                />
              </div>
            )}

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                वेबसाइट का अनुभव कैसा रहा? (Rating)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                  {rating === 5 ? 'शानदार ⭐⭐⭐⭐⭐' : rating >= 4 ? 'बहुत अच्छा ⭐⭐⭐⭐' : rating >= 3 ? 'ठीक-ठाक ⭐⭐⭐' : 'सुधार की जरूरत'}
                </span>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                आपकी राय, सुझाव या कोई समस्या *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="यहाँ अपना संदेश विस्तार से लिखें... जैसे नया फीचर, नया विचार या कोई समस्या..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-hidden resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md transition transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'भेजा जा रहा है...' : 'सुपरएडमिन को राय भेजें (Send Feedback)'}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
