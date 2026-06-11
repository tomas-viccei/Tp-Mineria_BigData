import { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useRecords } from '../context/RecordsContext';
import { Search, Filter, Loader2 } from 'lucide-react';

export const Registros = () => {
  const { tactos, pariciones, isLoading } = useRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const allRecords = useMemo(() => {
    const merged = [
      ...tactos.map((t) => ({ ...t, _type: 'tacto', _sortDate: t.fecha })),
      ...pariciones.map((p) => ({ ...p, _type: 'paricion', _sortDate: p.fecha_parto })),
    ];
    merged.sort((a, b) => new Date(b._sortDate) - new Date(a._sortDate));
    return merged;
  }, [tactos, pariciones]);

  const filteredRecords = useMemo(() => {
    let result = allRecords;

    if (filterType !== 'all') {
      result = result.filter((r) => r._type === filterType);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((r) => {
        if (r._type === 'tacto') {
          return String(r.caravana).toLowerCase().includes(term);
        }
        return (
          String(r.caravana_madre).toLowerCase().includes(term) ||
          String(r.caravana_cria).toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [allRecords, filterType, searchTerm]);

  const getBadgeVariant = (record) => {
    if (record._type === 'tacto') {
      return record.resultado === 'Positivo' ? 'success' : 'danger';
    }
    return record.sexo_cria === 'Macho' ? 'success' : 'info';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Historial de Registros</h1>
          <p className="text-sm text-slate-500 mt-1">Busque y filtre todos los eventos cargados en el establecimiento.</p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar por caravana..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white border-slate-200 shadow-sm focus:ring-emerald-500 text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none text-sm text-slate-600 font-medium shadow-sm min-w-[160px]"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos los Eventos</option>
              <option value="tacto">Tactos</option>
              <option value="paricion">Pariciones</option>
            </select>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border border-slate-200 shadow-sm relative min-h-[400px] bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tipo de Evento</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Caravana</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Resultado / Sexo</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => {
                  const isTacto = record._type === 'tacto';
                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium text-slate-700">
                          {isTacto ? 'Tacto' : 'Paricion'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {isTacto ? record.caravana : `${record.caravana_madre} / ${record.caravana_cria}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {isTacto ? record.fecha : record.fecha_parto}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getBadgeVariant(record)}>
                          {isTacto ? record.resultado : record.sexo_cria}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {isTacto && record.resultado === 'Positivo' && (
                          <span className="font-medium">{record.dias_gestacion} dias gest.</span>
                        )}
                        {isTacto && record.resultado === 'Negativo' && <span className="text-slate-400">N/A</span>}
                        {!isTacto && <span className="font-medium">{record.peso_nacer} kg al nacer</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <Filter className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        {isLoading ? 'Cargando registros...' : 'No hay registros disponibles en este momento.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
