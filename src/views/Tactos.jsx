import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useRecords } from '../context/RecordsContext';
import { Activity } from 'lucide-react';

const INITIAL_FORM = {
  caravana: '',
  fecha: new Date().toISOString().split('T')[0],
  resultado: '',
  dias_gestacion: '',
};

export const Tactos = () => {
  const { refetch } = useRecords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'resultado' && value === 'Negativo') {
        next.dias_gestacion = '0';
      } else if (id === 'resultado' && value !== 'Negativo' && prev.resultado === 'Negativo') {
        next.dias_gestacion = '';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        caravana: formData.caravana,
        fecha: formData.fecha,
        resultado: formData.resultado,
        dias_gestacion: Number(formData.dias_gestacion),
      };
      const response = await api.tactos.create(payload);
      toast.success(response.mensaje || response.message || 'Tacto registrado con exito.');
      setFormData({ ...INITIAL_FORM, fecha: new Date().toISOString().split('T')[0] });
      setTimeout(() => refetch(), 1500);
    } catch (error) {
      toast.error(error.message || 'Error al registrar el tacto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-6rem)] max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 mt-6">
        <div className="lg:col-span-4 flex flex-col">
          <div className="mb-8">
            <div className="bg-emerald-100/50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Registrar Tacto</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Cargue los resultados del tacto rectal o ecografia veterinaria para mantener un control estricto de la tasa de prenez.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">Importancia del Registro</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Asegurese de ingresar el numero de identificacion homologado del animal. Si el resultado es <strong>Negativo</strong>, los dias de gestacion se fijaran automaticamente en 0.
            </p>
          </div>
        </div>

        <Card className="lg:col-span-8 p-6 lg:p-8 bg-white shadow-sm ring-1 ring-slate-900/5">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="caravana"
                label="Caravana del Animal"
                type="text"
                required
                value={formData.caravana}
                onChange={handleChange}
                placeholder="Ej: 101"
              />
              <Input
                id="fecha"
                label="Fecha del Diagnostico"
                type="date"
                required
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="resultado"
                label="Resultado"
                required
                value={formData.resultado}
                onChange={handleChange}
                options={[
                  { value: 'Positivo', label: 'Positivo (Prenada)' },
                  { value: 'Negativo', label: 'Negativo (Vacia)' },
                ]}
              />
              <Input
                id="dias_gestacion"
                label="Dias de Gestacion"
                type="number"
                required={formData.resultado === 'Positivo'}
                disabled={formData.resultado === 'Negativo'}
                value={formData.dias_gestacion}
                onChange={handleChange}
                placeholder={formData.resultado === 'Negativo' ? '0' : 'Ej: 45'}
              />
            </div>

            <div className="pt-6 mt-6 flex justify-end border-t border-slate-100">
              <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto px-8 py-2.5 text-base shadow-sm">
                Guardar Registro
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
