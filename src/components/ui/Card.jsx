export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm ring-1 ring-slate-900/5 p-6 animate-fade-in-up ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);
