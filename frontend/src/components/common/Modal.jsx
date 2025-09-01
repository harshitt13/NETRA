import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button'; // Reusing our custom button

const Modal = ({ isOpen, onClose, title, children, footerContent }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="relative w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-900/50 animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h3 className="text-xl font-bold text-cyan-300 tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 rounded-full p-1 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 text-gray-300 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footerContent && (
          <div className="flex items-center justify-end p-4 border-t border-gray-700/50 space-x-3">
             {footerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
