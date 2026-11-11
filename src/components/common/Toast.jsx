
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export const Toast = ({
  type = 'success',
  message,
  onClose,
  duration = 3000
}) => {
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    error: <AlertCircle size={18} className="text-rose-400" />,
    info: <Info size={18} className="text-cyan-400" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-500/10',
    error: 'border-rose-500/30 bg-rose-500/10',
    info: 'border-cyan-500/30 bg-cyan-500/10'
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 ${borders[type] || borders.info}`}
    >
      {icons[type] || icons.info}

      <span className="text-sm font-medium text-slate-200">
        {message}
      </span>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
};
