import { Loader2 } from 'lucide-react';

export const Button = ({ children, isLoading, className = '', ...props }) => {
  return (
    <button
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-200 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg hover:from-emerald-700 hover:to-emerald-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
