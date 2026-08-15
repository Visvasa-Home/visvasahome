import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContextType {
  showToast: (title: string, message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000); // Auto-dismiss after 5s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-md w-full bg-white rounded-xl shadow-xl border-l-4 p-4 flex gap-3 transform transition-all duration-300 animate-in slide-in-from-top-5 pointer-events-auto
              ${
                toast.type === 'success' ? 'border-blue-500' :
                toast.type === 'error' ? 'border-blue-500' :
                toast.type === 'warning' ? 'border-blue-500' :
                'border-[#2563EB]'
              }
            `}
          >
            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${
                toast.type === 'success' ? 'bg-blue-100 text-blue-600' :
                toast.type === 'error' ? 'bg-blue-100 text-blue-600' :
                toast.type === 'warning' ? 'bg-blue-100 text-blue-600' :
                'bg-blue-100 text-[#2563EB]'
              }
            `}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
              <p className="text-xs text-gray-600 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 transition-colors h-fit p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
