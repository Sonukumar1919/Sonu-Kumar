import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Phone, 
  CheckCircle, 
  Clock, 
  Sparkles,
  KeyRound,
  Building2,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SHOP_CATEGORIES, RAWLA_AREAS } from '../data/constants';
import { ImageUploadField } from './ImageUploadField';

interface ShopRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (shopId: string) => void;
}

export const ShopRegistrationModal: React.FC<ShopRegistrationModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccess 
}) => {
  const { registerShop, currentUser } = useApp();

  // Step 2: Shop details (Step 1 Mobile OTP step removed per user request), Step 3: Success pending state
  const [step, setStep] = useState<2 | 3>(2);
  
  // Shop Form state
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [ownerName, setOwnerName] = useState(currentUser?.name || '');
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopPassword, setShopPassword] = useState('');
  const [category, setCategory] = useState(SHOP_CATEGORIES[0].label);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(RAWLA_AREAS[1]); // Default Main Market
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80');
  const [description, setDescription] = useState('');
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('08:30 PM');
  const [googleMapLocation, setGoogleMapLocation] = useState('https://maps.google.com/?q=Rawla+Mandi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedShopId, setSubmittedShopId] = useState<string>('');

  if (!isOpen) return null;

  // Submit Shop Details
  const handleSubmitShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !ownerName || !phone || !address || !shopEmail || !shopPassword) {
      alert('कृपया मोबाइल, ईमेल और पासवर्ड सहित सभी आवश्यक जानकारी भरें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const shopId = await registerShop({
        ownerUid: currentUser?.uid || 'user-' + phone.replace(/\D/g, ''),
        ownerName,
        shopName,
        email: shopEmail.trim().toLowerCase(),
        password: shopPassword.trim(),
        category,
        mobileNumber: phone,
        whatsappNumber: whatsappNumber || phone,
        address,
        area,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80',
        logoUrl: logoUrl || photoUrl,
        description: description || `${shopName} - रावला मंडी की विश्वसनीय दुकान।`,
        openingTime,
        closingTime,
        googleMapLocation
      });

      setSubmittedShopId(shopId);
      setIsSubmitting(false);
      setStep(3);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onSuccess(shopId);
    } catch (err) {
      setIsSubmitting(false);
      alert('पंजीकरण में त्रुटि आई, कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-amber-200 my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Store size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display">अपनी दुकान जोड़ें (Shop Registration)</h2>
              <p className="text-xs text-amber-100">रावला मंडी डिजिटल बाज़ार में दुकान पंजीकृत करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className={`flex items-center space-x-2 ${step === 2 ? 'text-amber-900' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              step === 2 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {step > 2 ? '✓' : '1'}
            </span>
            <span>दुकान की विस्तृत जानकारी (Shop Details)</span>
          </div>

          <div className="w-12 h-0.5 bg-amber-200"></div>

          <div className={`flex items-center space-x-2 ${step === 3 ? 'text-amber-900' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
              step === 3 ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              2
            </span>
            <span>स्वीकृति हेतु सबमिट (Approval Pending)</span>
          </div>
        </div>

        {/* Step 2: Shop Details Form */}
        {step === 2 && (
          <form onSubmit={handleSubmitShop} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-950 font-semibold">
              <Sparkles size={16} className="text-emerald-600 shrink-0" />
              <span>अपनी दुकान का विवरण भरें। सबमिट करने पर आपकी दुकान तुरंत रजिस्टर हो जाएगी।</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  दुकानदार का नाम (Owner Name) *
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="उदा. राहुल शर्मा"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  दुकान का नाम (Shop Name) *
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="उदा. शर्मा मोबाइल & इलेक्ट्रॉनिक्स"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            {/* Shop Credentials Box */}
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-amber-950 text-xs font-black uppercase">
                <KeyRound size={16} className="text-amber-600" />
                <span>दुकान लॉगिन क्रेडेंशियल (Shop Login Details) *</span>
              </div>
              <p className="text-[11px] text-amber-900 font-medium">
                इसी ईमेल व पासवर्ड से आप अपनी दुकान के डैशबोर्ड पर लॉगिन करके प्रोडक्ट्स जोड़ और प्रबंधित कर सकेंगे।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    दुकान की Gmail/ईमेल (Shop Email) *
                  </label>
                  <input
                    type="email"
                    value={shopEmail}
                    onChange={(e) => setShopEmail(e.target.value)}
                    placeholder="sharma@gmail.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    दुकान का पासवर्ड (Password) *
                  </label>
                  <input
                    type="password"
                    value={shopPassword}
                    onChange={(e) => setShopPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={4}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  दुकान की श्रेणी (Category) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                >
                  {SHOP_CATEGORIES.map(c => (
                    <option key={c.id} value={c.label} className="text-slate-900">{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  रावला मंडी क्षेत्र (Area / Location) *
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                >
                  {RAWLA_AREAS.filter(a => a !== 'सभी क्षेत्र (All Areas)').map(a => (
                    <option key={a} value={a} className="text-slate-900">{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  दुकान का संपर्क नंबर (Mobile Number) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9829012345"
                  maxLength={10}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  WhatsApp नंबर *
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="9829012345"
                  maxLength={10}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                दुकान का पूरा पता (Shop Address) *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा. दुकान नं. 14, मुख्य बाज़ार, बस स्टैंड के पास, रावला मंडी"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  खुलने का समय (Opening Time)
                </label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  बंद होने का समय (Closing Time)
                </label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  placeholder="08:30 PM"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageUploadField
                label="दुकान की मुख्य फ़ोटो (Shop Banner/Cover)"
                value={photoUrl}
                onChange={setPhotoUrl}
                required
                helpText="गैलरी से दुकान का मुख्य बोर्ड या आगे का दृश्य अपलोड करें"
                presetSamples={[
                  { label: 'मोबाइल', url: 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?auto=format&fit=crop&w=800&q=80' },
                  { label: 'कपड़े', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
                  { label: 'हार्डवेयर', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80' },
                  { label: 'मिठाई/होटल', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' }
                ]}
              />

              <ImageUploadField
                label="दुकान का लोगो या प्रोफ़ाइल (Logo/Avatar)"
                value={logoUrl}
                onChange={setLogoUrl}
                helpText="दुकान का लोगो या साइनबोर्ड फ़ोटो"
                presetSamples={[
                  { label: 'स्मार्ट लोगो', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80' },
                  { label: 'फैशन लोगो', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=200&q=80' }
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                दुकान का विवरण (Shop Description)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="आपकी दुकान पर क्या-क्या सामान व सुविधा उपलब्ध है, संक्षेप में लिखें..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Google Map Location Link (वैकल्पिक)
              </label>
              <input
                type="url"
                value={googleMapLocation}
                onChange={(e) => setGoogleMapLocation(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl text-sm font-extrabold shadow-lg transition cursor-pointer"
              >
                {isSubmitting ? 'अनुरोध सबमिट हो रहा है...' : 'Submit Shop Registration (दुकान सबमिट करें)'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Pending Notice */}
        {step === 3 && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Clock size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">
                दुकान पंजीकरण अनुरोध प्राप्त हुआ!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                बधाई हो! आपकी दुकान <strong>"{shopName}"</strong> का पंजीकरण अनुरोध सफलतापूर्वक सबमिट हो चुका है।
              </p>
            </div>

            <div className="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">दुकानदार:</span>
                <span className="font-bold text-slate-900">{ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">मोबाइल:</span>
                <span className="font-bold text-slate-900">+91 {phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">शॉप अप्रूवल स्थिति:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">⏳ Pending Approval</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">स्थान:</span>
                <span className="font-bold text-slate-900">{area}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              Super Admin द्वारा सत्यापन के बाद आपकी दुकान <strong>Active 🟢</strong> हो जाएगी और इसका डिजिटल चैनल RAWLA MANDI पर लाइव दिखेगा।
            </p>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
              >
                ठीक है (Close)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
