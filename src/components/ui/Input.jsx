import { forwardRef } from 'react';

export const Input = forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-3 py-2 text-slate-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
