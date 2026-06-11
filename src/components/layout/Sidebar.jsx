import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Baby, FileText, X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Registrar Tacto', path: '/tactos', icon: Stethoscope },
  { name: 'Registrar Parición', path: '/pariciones', icon: Baby },
  { name: 'Historial', path: '/registros', icon: FileText },
];

export const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-400 shadow-xl flex flex-col z-30 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-6 h-20 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AgTech <span className="text-emerald-400 font-semibold">Pro</span></span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="relative flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="relative p-4 border-t border-slate-800/60 text-xs text-slate-500 text-center">
        &copy; 2026 AgTech Systems
      </div>
    </aside>
  );
};
