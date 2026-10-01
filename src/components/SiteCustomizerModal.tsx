import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Save, 
  RotateCcw, 
  CheckCircle, 
  Sliders, 
  Type, 
  Layers, 
  Store, 
  MessageSquare,
  ShieldCheck,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Radio,
  Flame,
  Clock,
  Phone,
  MessageCircle,
  MapPin,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { DEFAULT_SETTINGS } from '../data/constants';
import { SystemSettings } from '../types';

interface SiteCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom';
}

export const SiteCustomizerModal: React.FC<SiteCustomizerModalProps> = ({ 
  isOpen, 
  onClose,
  initialCategory = 'branding'
}) => {
  const { 
    systemSettings, 
    updateSystemSettings, 
    customizerCategory, 
    selectedFieldForEdit, 
    setSelectedFieldForEdit,
    inlineEditMode,
    setInlineEditMode
  } = useApp();

  const [formData, setFormData] = useState<SystemSettings>({
    ...DEFAULT_SETTINGS,
    ...systemSettings
  });

  const [activeCategory, setActiveCategory] = useState<'branding' | 'buttons' | 'headings' | 'pages' | 'banner' | 'custom'>('branding');
  const [filterQuery, setFilterQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Custom Label input state
  const [newCustomKey, setNewCustomKey] = useState('');
  const [newCustomVal, setNewCustomVal] = useState('');

  // Synchronize when opened or when systemSettings changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...DEFAULT_SETTINGS,
        ...systemSettings
      });
      if (customizerCategory) {
        setActiveCategory(customizerCategory as any);
      }
    }
  }, [isOpen, systemSettings, customizerCategory]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSystemSettings(formData);
      setSavedSuccess(true);
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      setTimeout(() => {
        setSavedSuccess(false);
        setIsSaving(false);
        onClose();
      }, 1400);
    } catch (err) {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (confirm('क्या आप वेबसाइट के सभी नाम, बटन और टाइटल्स को मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      const reset = { ...DEFAULT_SETTINGS } as SystemSettings;
      setFormData(reset);
      await updateSystemSettings(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleAddCustomLabel = () => {
    if (!newCustomKey.trim() || !newCustomVal.trim()) return;
    const cleanKey = newCustomKey.trim().toLowerCase().replace(/\s+/g, '_');
    const existing = formData.customLabels || {};
    setFormData({
      ...formData,
      customLabels: {
        ...existing,
        [cleanKey]: newCustomVal.trim()
      }
    });
    setNewCustomKey('');
    setNewCustomVal('');
  };

  const handleDeleteCustomLabel = (keyToDelete: string) => {
    const existing = { ...(formData.customLabels || {}) };
    delete existing[keyToDelete];
    setFormData({
      ...formData,
      customLabels: existing
    });
  };

  // Helper to highlight targeted input
  const isTargetField = (fieldName: string) => selectedFieldForEdit === fieldName;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-amber-300 my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
              <Sliders size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
                  Superuser लाइव नाम व बटन एडिटर (Live CMS)
                </h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Live Sync 🟢
                </span>
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5 font-medium">
                साइट का कोई भी नाम, बटन, हेडिंग, टैगलाइन या टेक्स्ट कभी भी बदलें — सभी यूज़र्स को तुरंत लाइव दिखेगा!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Status Bar & Search Filter */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-amber-950 font-medium">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>
              <strong>लाइव ब्रॉडकास्ट सक्रिय:</strong> सेव करते ही सभी यूज़र्स के डिवाइस पर बिना रीफ़्रेश तुरंत अपडेट हो जाएगा।
            </span>
          </div>

          {/* Quick Filter Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="नाम या बटन खोजें (जैसे: कॉल, होम)..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="bg-slate-100 px-4 py-2 flex items-center space-x-2 overflow-x-auto border-b border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveCategory('branding'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'branding' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            🏢 1. साइट नाम & ब्रांडिंग
          </button>
          <button
            type="button"
            onClick={() => { setActiveCategory('buttons'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'buttons' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔘 2. सभी बटन के नाम
          </button>
          <button
            type="button"
            onClick={() => { setActiveCategory('headings'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'headings' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            📑 3. सेक्शन्स व हेडिंग्स
          </button>
          <button
            type="button"
            onClick={() => { setActiveCategory('pages'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'pages' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔍 4. सर्च, श्रेणी & लोकेशन
          </button>
          <button
            type="button"
            onClick={() => { setActiveCategory('banner'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'banner' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            📢 5. मंडी सूचना पट्टी
          </button>
          <button
            type="button"
            onClick={() => { setActiveCategory('custom'); setSelectedFieldForEdit(null); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              activeCategory === 'custom' 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            ➕ 6. कस्टम नाम/बटन
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-600 text-white px-5 py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 animate-in fade-in shrink-0">
            <CheckCircle size={18} />
            <span>सफलतापूर्वक लाइव सेव हो गया! सभी यूज़र्स को तुरंत अपडेट दिखाई देगा।</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* TAB 1: BRANDING & NAMES */}
          {activeCategory === 'branding' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                यहाँ से आप वेबसाइट का मुख्य नाम, लोगो के पास दिखने वाला बैज, नीचे की टैगलाइन और सबसे ऊपर चलने वाला टिकर बदल सकते हैं।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-3 rounded-2xl border transition ${isTargetField('siteName') ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    वेबसाइट का मुख्य नाम (Site Name)
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">उदा: RAWLA (लोगो का पहला भाग)</span>
                </div>

                <div className={`p-3 rounded-2xl border transition ${isTargetField('siteNameHighlight') ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    हाइलाइट नाम (Highlight Word)
                  </label>
                  <input
                    type="text"
                    value={formData.siteNameHighlight}
                    onChange={(e) => setFormData({ ...formData, siteNameHighlight: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-amber-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">उदा: MANDI (नारंगी रंग में हाइलाइट शब्द)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-3 rounded-2xl border transition ${isTargetField('siteTagline') ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    टैगलाइन (Tagline Under Logo)
                  </label>
                  <input
                    type="text"
                    value={formData.siteTagline}
                    onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">लोगो के नीचे दिखने वाली उप-पंक्ति</span>
                </div>

                <div className={`p-3 rounded-2xl border transition ${isTargetField('badgeText') ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    बैज टेक्स्ट (Badge Beside Logo)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-amber-700"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">उदा: लोकल बाज़ार / डिजिटल मंडी</span>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border transition ${isTargetField('tickerNotice') ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400' : 'border-slate-200 bg-slate-50'}`}>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  शीर्ष टिकर सूचना (Top Breaking Ticker)
                </label>
                <input
                  type="text"
                  value={formData.tickerNotice}
                  onChange={(e) => setFormData({ ...formData, tickerNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">सबसे ऊपर नारंगी पट्टी में चलने वाली मुख्य सूचना</span>
              </div>
            </div>
          )}

          {/* TAB 2: BUTTON LABELS */}
          {activeCategory === 'buttons' && (
            <div className="space-y-5">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                वेबसाइट के प्रत्येक बटन पर लिखा हुआ नाम अपनी इच्छानुसार कभी भी बदलें:
              </div>

              {/* Bottom 4 Nav Buttons */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="block text-xs font-extrabold text-slate-800 uppercase">
                  📱 निचले 4 मुख्य नेविगेशन बटन (Bottom Nav Bar Buttons)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={isTargetField('navHomeText') ? 'ring-2 ring-amber-400 rounded-xl p-1 bg-amber-50' : ''}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">बटन 1 (होम)</label>
                    <input
                      type="text"
                      value={formData.navHomeText}
                      onChange={(e) => setFormData({ ...formData, navHomeText: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className={isTargetField('navSearchText') ? 'ring-2 ring-amber-400 rounded-xl p-1 bg-amber-50' : ''}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">बटन 2 (सर्च)</label>
                    <input
                      type="text"
                      value={formData.navSearchText}
                      onChange={(e) => setFormData({ ...formData, navSearchText: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className={isTargetField('navAreaText') ? 'ring-2 ring-amber-400 rounded-xl p-1 bg-amber-50' : ''}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">बटन 3 (लोकेशन)</label>
                    <input
                      type="text"
                      value={formData.navAreaText}
                      onChange={(e) => setFormData({ ...formData, navAreaText: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className={isTargetField('navUserText') ? 'ring-2 ring-amber-400 rounded-xl p-1 bg-amber-50' : ''}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">बटन 4 (यूज़र)</label>
                    <input
                      type="text"
                      value={formData.navUserText}
                      onChange={(e) => setFormData({ ...formData, navUserText: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add Shop, Call, WhatsApp, Location, View Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-3 rounded-2xl border ${isTargetField('addShopButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    हेडर "दुकान जोड़ें" बटन टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={formData.addShopButtonText}
                    onChange={(e) => setFormData({ ...formData, addShopButtonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div className={`p-3 rounded-2xl border ${isTargetField('ctaButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    बैनर CTA "दुकान जोड़ें" बटन
                  </label>
                  <input
                    type="text"
                    value={formData.ctaButtonText}
                    onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-2xl border ${isTargetField('callButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    📞 कॉल बटन टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={formData.callButtonText}
                    onChange={(e) => setFormData({ ...formData, callButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className={`p-3 rounded-2xl border ${isTargetField('whatsappButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    💬 WhatsApp बटन टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappButtonText}
                    onChange={(e) => setFormData({ ...formData, whatsappButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className={`p-3 rounded-2xl border ${isTargetField('locationButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    📍 Location / मैप बटन
                  </label>
                  <input
                    type="text"
                    value={formData.locationButtonText || 'Location (नक्शा)'}
                    onChange={(e) => setFormData({ ...formData, locationButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-2xl border ${isTargetField('viewChannelButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    🏪 "दुकान चैनल देखें" बटन
                  </label>
                  <input
                    type="text"
                    value={formData.viewChannelButtonText || 'दुकान चैनल देखें'}
                    onChange={(e) => setFormData({ ...formData, viewChannelButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className={`p-3 rounded-2xl border ${isTargetField('likeButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    ❤️ "लाइक" बटन टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={formData.likeButtonText || 'लाइक'}
                    onChange={(e) => setFormData({ ...formData, likeButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className={`p-3 rounded-2xl border ${isTargetField('searchButtonText') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    🔍 "खोजें" बटन टेक्स्ट
                  </label>
                  <input
                    type="text"
                    value={formData.searchButtonText || 'खोजें'}
                    onChange={(e) => setFormData({ ...formData, searchButtonText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTIONS & HEADINGS */}
          {activeCategory === 'headings' && (
            <div className="space-y-5">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                यहाँ से आप होमपेज के तीनों स्तर (1. सुपर न्यू प्रोडक्ट्स स्लाइडर, 2. ट्रेंडिंग पोस्ट्स 5s स्लाइडर, 3. बची हुई पोस्ट्स फ़ीड) व अन्य सभी मुख्य हेडिंग्स बदल सकते हैं।
              </div>

              {/* 1. Super New Slider Heading */}
              <div className={`p-4 rounded-2xl border ${isTargetField('heroSuperNewTitle') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 mb-2">
                  <Flame size={16} className="text-amber-600" />
                  <label className="text-xs font-extrabold text-slate-800 uppercase">
                    1. सुपर न्यू प्रोडक्ट्स ऑटो-स्वाइप स्लाइडर
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.heroSuperNewTitle}
                  onChange={(e) => setFormData({ ...formData, heroSuperNewTitle: e.target.value })}
                  placeholder="मुख्य शीर्षक"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900"
                />
                <input
                  type="text"
                  value={formData.heroSuperNewSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSuperNewSubtitle: e.target.value })}
                  placeholder="सबटाइटल (विवरण)"
                  className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>

              {/* 2. Top-Rated 5-sec Slider Heading */}
              <div className={`p-4 rounded-2xl border ${isTargetField('heroTopRatedTitle') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 mb-2">
                  <Clock size={16} className="text-rose-600" />
                  <label className="text-xs font-extrabold text-slate-800 uppercase">
                    2. 5-सेकंड ऑटो स्वाइप ट्रेंडिंग पोस्ट्स स्लाइडर
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.heroTopRatedTitle}
                  onChange={(e) => setFormData({ ...formData, heroTopRatedTitle: e.target.value })}
                  placeholder="मुख्य शीर्षक"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900"
                />
                <input
                  type="text"
                  value={formData.heroTopRatedSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroTopRatedSubtitle: e.target.value })}
                  placeholder="सबटाइटल (विवरण)"
                  className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>

              {/* 3. Remaining Posts Stacked Feed Heading */}
              <div className={`p-4 rounded-2xl border ${isTargetField('heroRemainingTitle') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 mb-2">
                  <Layers size={16} className="text-amber-600" />
                  <label className="text-xs font-extrabold text-slate-800 uppercase">
                    3. बची हुई सभी पोस्ट्स फ़ीड (एक के नीचे एक)
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.heroRemainingTitle}
                  onChange={(e) => setFormData({ ...formData, heroRemainingTitle: e.target.value })}
                  placeholder="मुख्य शीर्षक"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900"
                />
                <input
                  type="text"
                  value={formData.heroRemainingSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroRemainingSubtitle: e.target.value })}
                  placeholder="सबटाइटल (विवरण)"
                  className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>

              {/* 4. Shops Directory Title */}
              <div className={`p-4 rounded-2xl border ${isTargetField('shopsListTitle') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 mb-2">
                  <Store size={16} className="text-emerald-600" />
                  <label className="text-xs font-extrabold text-slate-800 uppercase">
                    4. स्थानीय दुकानें डायरेक्टरी ग्रिड हेडिंग
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.shopsListTitle || '🏢 स्थानीय दुकानें व व्यावसायिक प्रतिष्ठान (Verified Shops)'}
                  onChange={(e) => setFormData({ ...formData, shopsListTitle: e.target.value })}
                  placeholder="डायरेक्टरी शीर्षक"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
                <input
                  type="text"
                  value={formData.shopsListSubtitle || 'रावला मंडी के सभी सत्यापित व विश्वसनीय दुकानदारों की सूची'}
                  onChange={(e) => setFormData({ ...formData, shopsListSubtitle: e.target.value })}
                  placeholder="सबटाइटल"
                  className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>

              {/* 5. Shopkeeper CTA Card */}
              <div className={`p-4 rounded-2xl border ${isTargetField('ctaTitle') ? 'ring-2 ring-amber-400 bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-200'}`}>
                <label className="block text-xs font-extrabold text-slate-800 uppercase mb-2">
                  5. दुकानदारों के लिए CTA कार्ड (क्या आपकी दुकान रावला मंडी में है?)
                </label>
                <input
                  type="text"
                  value={formData.ctaTitle}
                  onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                  placeholder="कार्ड शीर्षक"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-slate-900"
                />
                <textarea
                  rows={2}
                  value={formData.ctaSubtitle}
                  onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                  placeholder="कार्ड विवरण पंक्ति"
                  className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PAGES & SEARCH HEADINGS */}
          {activeCategory === 'pages' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                यहाँ से आप सर्च बार का प्लेसहोल्डर, सर्च & श्रेणी पेज का टाइटल और एरिया/लोकेशन पेज का टाइटल बदल सकते हैं।
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  सर्च बार प्लेसहोल्डर (Search Bar Placeholder)
                </label>
                <input
                  type="text"
                  value={formData.searchPlaceholder || 'दुकान, सामान या पोस्ट खोजें... (जैसे: Mobile, कपड़े, खाद, रसगुल्ले)'}
                  onChange={(e) => setFormData({ ...formData, searchPlaceholder: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    सर्च & श्रेणी पेज शीर्षक
                  </label>
                  <input
                    type="text"
                    value={formData.searchPageTitle || '🔍 दुकान खोजें व श्रेणियां (Search & Categories)'}
                    onChange={(e) => setFormData({ ...formData, searchPageTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={formData.searchPageSubtitle || 'दुकान का नाम या सामान लिखकर सर्च करें, अथवा नीचे दी गई श्रेणियों में से चुनें।'}
                    onChange={(e) => setFormData({ ...formData, searchPageSubtitle: e.target.value })}
                    className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    एरिया & लोकेशन पेज शीर्षक
                  </label>
                  <input
                    type="text"
                    value={formData.areaPageTitle || '📍 क्षेत्र अनुसार दुकानें (Area & Location)'}
                    onChange={(e) => setFormData({ ...formData, areaPageTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={formData.areaPageSubtitle || 'रावला मंडी के अपने नजदीकी क्षेत्र को चुनें और वहां स्थित सभी सक्रिय दुकानों की सटीक लोकेशन देखें।'}
                    onChange={(e) => setFormData({ ...formData, areaPageSubtitle: e.target.value })}
                    className="w-full mt-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANNOUNCEMENT BANNER */}
          {activeCategory === 'banner' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                यह मुख्य सूचना पट्टी होमपेज पर सबसे ऊपर लाल/नारंगी रंग में प्रदर्शित होती है। कोई भी विशेष ऑफर, पर्व शुभकामना या आवश्यक सूचना यहाँ लिखें।
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  होमपेज मुख्य सूचना पट्टी (Announcement Banner Text)
                </label>
                <textarea
                  rows={4}
                  value={formData.bannerNotice}
                  onChange={(e) => setFormData({ ...formData, bannerNotice: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOM DYNAMIC LABELS */}
          {activeCategory === 'custom' && (
            <div className="space-y-5">
              <div className="p-3.5 bg-gradient-to-r from-purple-50 to-amber-50 rounded-2xl border border-purple-200 text-xs text-purple-950 font-medium">
                यदि आप वेबसाइट पर कोई नया नाम या नया बटन टेक्स्ट जोड़ना चाहते हैं जो ऊपर की सूचियों में नहीं है, तो आप यहाँ अपनी इच्छानुसार कोई भी नया नाम/लेबल बना सकते हैं!
              </div>

              {/* Add New Key/Value */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase block">
                  नया नाम/बटन टेक्स्ट जोड़ें
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">पहचान नाम (Key Name)</label>
                    <input
                      type="text"
                      value={newCustomKey}
                      onChange={(e) => setNewCustomKey(e.target.value)}
                      placeholder="उदा: footer_notice, shop_call_btn"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">दिखने वाला टेक्स्ट (Label Value)</label>
                    <input
                      type="text"
                      value={newCustomVal}
                      onChange={(e) => setNewCustomVal(e.target.value)}
                      placeholder="उदा: 24/7 आपातकालीन नंबर"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomLabel}
                  disabled={!newCustomKey.trim() || !newCustomVal.trim()}
                  className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Plus size={14} />
                  <span>यह कस्टम लेबल जोड़ें</span>
                </button>
              </div>

              {/* Existing Custom Labels List */}
              {formData.customLabels && Object.keys(formData.customLabels).length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase block">मौजूदा कस्टम लेबल्स:</span>
                  <div className="space-y-2">
                    {Object.entries(formData.customLabels).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="font-mono text-slate-500 font-bold mr-2">[{key}]:</span>
                          <span className="font-bold text-slate-900">{val}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomLabel(key)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons in Footer of Modal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw size={14} />
              <span>डिफ़ॉल्ट पर रीसेट करें (Reset to Default)</span>
            </button>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                रद्द करें
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isSaving ? 'सेव हो रहा है...' : 'Save & Publish Live (लाइव प्रकाशित करें)'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
