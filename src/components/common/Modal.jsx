import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`relative w-full ${maxWidth} glass-modal rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col animate-fade-in`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto pt-4 pr-1 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
