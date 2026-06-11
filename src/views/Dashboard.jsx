import { useMemo } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { useRecords } from '../context/RecordsContext';
import { Baby, Stethoscope, TrendingUp, Scale, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';

const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Hace unos minutos';
  if (diffHours === 1) return 'Hace 1 hora';
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} dias`;
};

export const Dashboard = () => {
  const { tactos, pariciones, isLoading, error } = useRecords();

  const stats = useMemo(() => {
    const totalTactos = tactos.length;
    const positivos = tactos.filter((t) => t.resultado === 'Positivo').length;
    const negativos = totalTactos - positivos;
    const tasaPrenes = totalTactos > 0 ? ((positivos / totalTactos) * 100).toFixed(1) : '0.0';

    const totalPariciones = pariciones.length;
    const machos = pariciones.filter((p) => p.sexo_cria === 'Macho').length;
    const hembras = totalPariciones - machos;

    const pesos = pariciones.map((p) => Number(p.peso_nacer)).filter((p) => !isNaN(p) && p > 0);
    const pesoPromedio = pesos.length > 0 ? (pesos.reduce((a, b) => a + b, 0) / pesos.length).toFixed(1) : null;

    return { totalTactos, positivos, negativos, tasaPrenes, totalPariciones, machos, hembras, pesoPromedio };
  }, [tactos, pariciones]);

  const donutData = useMemo(() => {
    if (stats.totalTactos === 0) return [];
    return [
      { name: 'Positivos (Prenadas)', value: stats.positivos, color: '#10b981' },
      { name: 'Negativos (Vacias)', value: stats.negativos, color: '#f43f5e' },
    ];
  }, [stats]);

  const tipoPartoData = useMemo(() => {
    if (pariciones.length === 0) return [];
    const counts = {};
    pariciones.forEach((p) => {
      const tipo = p.observaciones || 'Sin dato';
      counts[tipo] = (counts[tipo] || 0) + 1;
    });
    const colorMap = {
      'Parto Normal': '#10b981',
      'Asistencia leve': '#f59e0b',
      'Distocia': '#ef4444',
    };
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || '#94a3b8',
    }));
  }, [pariciones]);

  const activity = useMemo(() => {
    const merged = [
      ...tactos.map((t) => ({ ...t, _type: 'tacto', _sortDate: t.fecha })),
      ...pariciones.map((p) => ({ ...p, _type: 'paricion', _sortDate: p.fecha_parto })),
    ];
    merged.sort((a, b) => new Date(b._sortDate) - new Date(a._sortDate));
    return merged.slice(0, 6);
  }, [tactos, pariciones]);

  const kpis = [
    {
      title: 'Tactos Realizados',
      value: stats.totalTactos,
      badgeText: `${stats.positivos} positivos / ${stats.negativos} negativos`,
      icon: Stethoscope,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Tasa de Prenez',
      value: `${stats.tasaPrenes}%`,
      badgeText: stats.totalTactos > 0 ? `Basado en ${stats.totalTactos} tactos` : 'Sin datos',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Pariciones Registradas',
      value: stats.totalPariciones,
      badgeText: `${stats.machos} machos / ${stats.hembras} hembras`,
      icon: Baby,
      iconBg: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Peso Promedio al Nacer',
      value: stats.pesoPromedio ? `${stats.pesoPromedio} kg` : '--',
      badgeText: stats.pesoPromedio ? 'Rango normal: 25-40 kg' : 'Sin datos de pariciones',
      icon: Scale,
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Cargando datos del servidor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-slate-50">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-slate-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)] rounded-tl-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard General</h1>
        <p className="text-sm text-slate-500 mt-1">Analisis de eficiencia reproductiva y estado del rodeo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="flex flex-col justify-between bg-white shadow-sm ring-1 ring-slate-900/5 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase">{kpi.title}</p>
                  <p className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${kpi.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                {kpi.badgeText}
              </span>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col bg-white shadow-sm ring-1 ring-slate-900/5 p-6">
          <CardHeader title="Tasa de Exito en Tactos" subtitle="Proporcion Positivo vs Negativo" />
          {donutData.length > 0 ? (
            <>
              <div className="h-72 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-medium text-slate-500">Efectividad</span>
                  <span className="text-3xl font-bold text-slate-800">{stats.tasaPrenes}%</span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {donutData.map((item, idx) => {
                  const pct = ((item.value / stats.totalTactos) * 100).toFixed(1);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600 font-medium">
                        {item.name} ({item.value} - {pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-72 mt-4 flex items-center justify-center">
              <p className="text-slate-400 text-sm">No hay registros de tactos disponibles.</p>
            </div>
          )}
        </Card>

        <Card className="flex flex-col bg-white shadow-sm ring-1 ring-slate-900/5 p-6">
          <CardHeader title="Tipo de Parto" subtitle="Distribucion por dificultad del parto" />
          {tipoPartoData.length > 0 ? (
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tipoPartoData} margin={{ top: 30, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" name="Cantidad" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {tipoPartoData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="#334155" fontSize={12} fontWeight={600} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 mt-4 flex items-center justify-center">
              <p className="text-slate-400 text-sm">No hay registros de pariciones disponibles.</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="bg-white shadow-sm ring-1 ring-slate-900/5 p-6">
        <CardHeader title="Actividad Reciente" subtitle="Ultimos eventos registrados" />
        {activity.length > 0 ? (
          <div className="mt-8 relative border-l-2 border-slate-100 ml-4 pl-8 space-y-10">
            {activity.map((record, index) => {
              const isTacto = record._type === 'tacto';

              let bgClass, ringClass, badgeText;

              if (isTacto) {
                if (record.resultado === 'Positivo') {
                  bgClass = 'bg-emerald-100 text-emerald-600';
                  ringClass = 'ring-emerald-50';
                  badgeText = 'Tacto Positivo';
                } else {
                  bgClass = 'bg-rose-100 text-rose-600';
                  ringClass = 'ring-rose-50';
                  badgeText = 'Tacto Negativo';
                }
              } else {
                if (record.sexo_cria === 'Macho') {
                  bgClass = 'bg-blue-100 text-blue-600';
                  ringClass = 'ring-blue-50';
                  badgeText = `Nacimiento Macho${record.peso_nacer ? ` (${record.peso_nacer}kg)` : ''}`;
                } else {
                  bgClass = 'bg-pink-100 text-pink-600';
                  ringClass = 'ring-pink-50';
                  badgeText = `Nacimiento Hembra${record.peso_nacer ? ` (${record.peso_nacer}kg)` : ''}`;
                }
              }

              return (
                <div key={index} className="relative flex items-start gap-4">
                  <span className="absolute -left-[45px] top-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ring-4 bg-white ${ringClass}`}>
                      <div className={`w-3 h-3 rounded-full ${bgClass.split(' ')[0].replace('100', '500')}`} />
                    </div>
                  </span>
                  <div className="flex-1 bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${bgClass}`}>
                            {badgeText}
                          </span>
                          <p className="font-semibold text-slate-800 text-sm">
                            ID: {(isTacto ? record.caravana : record.caravana_madre) || 'S/D'}
                          </p>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                          {isTacto
                            ? record.resultado === 'Positivo'
                              ? `Dias de gestacion: ${record.dias_gestacion ?? 'S/D'}`
                              : 'Animal vacio. Requiere revision para proximo servicio.'
                            : `Observaciones: ${record.observaciones || 'Sin observaciones'}`}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {getRelativeTime(record._sortDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-8 text-center">No hay actividad reciente registrada.</p>
        )}
      </Card>
    </div>
  );
};
