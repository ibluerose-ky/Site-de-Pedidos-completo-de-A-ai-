import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl backdrop-blur-md border animate-slide-down transition-all ${
              isSuccess
                ? 'bg-[#2b0239] text-white border-amber-400/40'
                : isError
                ? 'bg-red-950 text-white border-red-500/50'
                : 'bg-zinc-900 text-white border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-purple-300 shrink-0" />}
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 ml-2"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
