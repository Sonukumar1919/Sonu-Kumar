import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  KeyRound, 
  CheckCircle, 
  User, 
  ShieldCheck, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose }) => {
  const { sendOtp, verifyOtp, loginWithGoogle, loginAsDemoUser } = useApp();

  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.replace(/\D/g, '').length < 10) {
      setError('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें');
      return;
    }
    setLoading(true);
    const res = await sendOtp(phone);
    setGeneratedOtp(res.otp);
    setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await verifyOtp(phone, otpInput, 'customer', userName || 'रावला मंडी ग्राहक');
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError('अमान्य OTP! कृपया स्क्रीन पर प्रदर्शित OTP दर्ज करें (या 123456)।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-amber-100 my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">लॉगिन / साइन-अप</h2>
              <p className="text-xs text-amber-100">पासवर्ड की आवश्यकता नहीं • सुरक्षित OTP लॉगिन</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  आपका नाम (Your Name)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  मोबाइल नंबर (Mobile Number) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9829012345"
                    maxLength={10}
                    required
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-semibold text-rose-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
              >
                {loading ? 'OTP भेजा जा रहा है...' : 'Send OTP (ओटीपी प्राप्त करें)'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Visual simulated OTP toast for demo convenience */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-emerald-800 text-xs font-bold">
                  <KeyRound size={14} />
                  <span>सिम्युलेटेड SMS OTP:</span>
                </div>
                <div className="text-2xl font-black tracking-widest text-emerald-900 font-mono">
                  {generatedOtp}
                </div>
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp || '123456')}
                  className="text-[11px] text-emerald-700 font-bold underline cursor-pointer"
                >
                  यहाँ क्लिक करके तुरंत भरें (Auto-fill)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  6 अंकों का OTP दर्ज करें
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full text-center tracking-widest py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-rose-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
              >
                {loading ? 'सत्यापित हो रहा है...' : 'Verify OTP & Login'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 mx-auto"
                >
                  <RotateCcw size={12} />
                  <span>नंबर बदलें / पुनः OTP भेजें</span>
                </button>
              </div>
            </form>
          )}

          {/* Google Sign In option */}
          <div className="pt-2">
            <button
              type="button"
              onClick={async () => {
                const ok = await loginWithGoogle();
                if (ok) onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google द्वारा लॉगिन करें</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
