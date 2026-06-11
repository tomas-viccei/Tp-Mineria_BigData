import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useRecords } from '../context/RecordsContext';
import { Baby, AlertTriangle } from 'lucide-react';

const INITIAL_FORM = {
  caravana_madre: '',
  caravana_cria: '',
  fecha_parto: new Date().toISOString().split('T')[0],
  sexo_cria: '',
  peso_nacer: '',
  observaciones: '',
};

export const Pariciones = () => {
  const { refetch } = useRecords();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [backendErrors, setBackendErrors] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (backendErrors.length > 0) setBackendErrors([]);
  };

  const validate = () => {
    const errors = [];

    const caravanaMadre = Number(formData.caravana_madre);
    if (!formData.caravana_madre || !Number.isInteger(caravanaMadre) || caravanaMadre <= 0) {
      errors.push('La caravana de la madre debe ser un numero entero positivo.');
    }

    const caravanaCria = Number(formData.caravana_cria);
    if (!formData.caravana_cria || !Number.isInteger(caravanaCria) || caravanaCria <= 0) {
      errors.push('La caravana de la cria debe ser un numero entero positivo.');
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaParto = new Date(formData.fecha_parto + 'T00:00:00');
    if (fechaParto > hoy) {
      errors.push('La fecha de parto no puede ser una fecha futura.');
    }

    if (!formData.sexo_cria) {
      errors.push('Debe seleccionar el sexo de la cria.');
    }

    const peso = Number(formData.peso_nacer);
    if (isNaN(peso) || peso < 15 || peso > 60) {
      errors.push('El peso al nacer debe estar entre 15 y 60 kg.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendErrors([]);

    const erroresValidacion = validate();
    if (erroresValidacion.length > 0) {
      toast.error(
        <div>
          <p className="font-semibold mb-1">Errores de validacion:</p>
          <ul className="list-disc list-inside text-sm space-y-0.5">
            {erroresValidacion.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        caravana_madre: Number(formData.caravana_madre),
        caravana_cria: Number(formData.caravana_cria),
        fecha_parto: formData.fecha_parto,
        sexo_cria: formData.sexo_cria,
        peso_nacer: Number(formData.peso_nacer),
        observaciones: formData.observaciones,
      };

      const response = await api.pariciones.create(payload);
      toast.success(response.mensaje || response.message || 'Paricion registrada con exito.');
      setFormData({ ...INITIAL_FORM, fecha_parto: new Date().toISOString().split('T')[0] });
      setTimeout(() => refetch(), 1500);
    } catch (error) {
      if (error.data?.detalles && Array.isArray(error.data.detalles)) {
        setBackendErrors(error.data.detalles);
      } else {
        toast.error(error.message || 'Error al registrar la paricion.');
      }
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
              <Baby className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Registrar Paricion</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Cargue los datos de un nuevo nacimiento o evento de parto en el lote para mantener las proyecciones actualizadas.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60 space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">Validaciones Activas</h2>
            <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc list-inside">
              <li>Ambas caravanas deben ser <strong>enteros positivos</strong>.</li>
              <li>La fecha de parto <strong>no puede ser futura</strong>.</li>
              <li>El peso al nacer debe estar entre <strong>15 y 60 kg</strong>.</li>
            </ul>
          </div>
        </div>

        <Card className="lg:col-span-8 p-6 lg:p-8 bg-white shadow-sm ring-1 ring-slate-900/5">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {backendErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="text-sm font-semibold text-red-800">Error del servidor:</p>
                </div>
                {backendErrors.map((err, i) => (
                  <p key={i} className="text-sm text-red-700 flex items-start gap-2 ml-6">
                    <span className="text-red-400 mt-0.5 shrink-0">-</span>
                    {err}
                  </p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="caravana_madre"
                label="Caravana de la Madre"
                type="number"
                required
                value={formData.caravana_madre}
                onChange={handleChange}
                placeholder="Ej: 101"
              />
              <Input
                id="caravana_cria"
                label="Caravana de la Cria"
                type="number"
                required
                value={formData.caravana_cria}
                onChange={handleChange}
                placeholder="Ej: 501"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="fecha_parto"
                label="Fecha del Parto"
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={formData.fecha_parto}
                onChange={handleChange}
              />
              <Select
                id="sexo_cria"
                label="Sexo de la cria"
                required
                value={formData.sexo_cria}
                onChange={handleChange}
                options={[
                  { value: 'Macho', label: 'Macho' },
                  { value: 'Hembra', label: 'Hembra' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="peso_nacer"
                label="Peso al nacer (kg)"
                type="number"
                step="0.1"
                min="15"
                max="60"
                required
                value={formData.peso_nacer}
                onChange={handleChange}
                placeholder="Entre 15 y 60 kg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                id="observaciones"
                label="Observaciones del Parto"
                required
                value={formData.observaciones}
                onChange={handleChange}
                options={[
                  { value: 'Parto Normal', label: 'Parto Normal' },
                  { value: 'Asistencia leve', label: 'Asistencia leve' },
                  { value: 'Distocia', label: 'Distocia' },
                ]}
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
