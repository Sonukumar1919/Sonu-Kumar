import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Check, Camera, RefreshCw, Link2 } from 'lucide-react';
import { compressAndReadImageFile } from '../utils/imageUtils';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  required?: boolean;
  helpText?: string;
  presetSamples?: { label: string; url: string }[];
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  helpText,
  presetSamples
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल फ़ोटो (Image) फ़ाइल चुनें।');
      return;
    }

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressAndReadImageFile(file, 900, 900, 0.78);
      onChange(compressedDataUrl);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      alert('फोटो प्रोसेस करने में समस्या आई, कृपया पुनः प्रयास करें।');
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setUrlInput('');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
        >
          <Link2 size={12} />
          <span>{showUrlInput ? 'गैलरी अपलोडर' : 'URL द्वारा जोड़ें'}</span>
        </button>
      </div>

      {/* Hidden native file input accepting all images / camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Direct URL Input Mode */}
      {showUrlInput ? (
        <div className="flex space-x-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="फ़ोटो का सीधा लिंक (https://...) पेस्ट करें"
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl"
          >
            लागू करें
          </button>
        </div>
      ) : (
        /* Gallery Upload Area */
        <div className="relative">
          {value ? (
            /* Selected Photo Preview */
            <div className="relative group rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-slate-900/5 shadow-xs">
              <div className="h-44 sm:h-48 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <img
                  src={value}
                  alt="Selected Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with change/remove buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-1.5 bg-white text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-amber-50 transition cursor-pointer"
                >
                  <RefreshCw size={14} className="text-amber-600" />
                  <span>गैलरी से बदलें</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center space-x-1 bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-rose-700 transition cursor-pointer"
                >
                  <X size={14} />
                  <span>हटाएं</span>
                </button>
              </div>

              {/* Status pill bottom left */}
              <div className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-xs">
                <Check size={11} />
                <span>फ़ोटो चयनित (Ready)</span>
              </div>
            </div>
          ) : (
            /* Empty state: Click to pick from device gallery */
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2.5 ${
                isProcessing
                  ? 'border-amber-400 bg-amber-50/50'
                  : 'border-slate-300 hover:border-amber-500 bg-slate-50/80 hover:bg-amber-50/40'
              }`}
            >
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-bold text-amber-800">फ़ोटो प्रोसेस की जा रही है...</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      📁 गैलरी या कैमरा से फोटो चुनें
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      (Choose from Device Gallery / Camera) • JPG, PNG, WEBP
                    </span>
                  </div>
                  <div className="inline-flex items-center space-x-1 bg-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-xs">
                    <Camera size={12} />
                    <span>अपलोड करें (Browse)</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preset samples shortcuts if available */}
      {presetSamples && presetSamples.length > 0 && !value && (
        <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[11px] text-slate-500">
          <span className="font-medium">या नमूना चुनें:</span>
          {presetSamples.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(p.url)}
              className="text-amber-700 hover:text-amber-900 underline font-semibold"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {helpText && (
        <p className="text-[11px] text-slate-400">{helpText}</p>
      )}
    </div>
  );
};
