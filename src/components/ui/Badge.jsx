export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/10',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20', // Positivo / Macho
    warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/20',
    danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',      // Negativo
    info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',        // Hembra / Pariciones
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
