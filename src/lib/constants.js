export const SECTORS = [
  { value: 'gobierno', label: 'Gobierno / Alcaldía' },
  { value: 'constructora', label: 'Constructora / Inmobiliaria' },
  { value: 'hotel_turismo', label: 'Hotel & Turismo' },
  { value: 'educacion', label: 'Educación (Colegio / Jardín)' },
  { value: 'salud', label: 'Salud (Clínica / Centro)' },
  { value: 'comercial', label: 'Comercial (C. Comercial / Aeropuerto)' },
  { value: 'pet_friendly', label: 'Pet-friendly / Veterinaria' },
  { value: 'caja_compensacion', label: 'Caja de Compensación' },
  { value: 'gastronomia', label: 'Gastronomía / Restaurante' },
  { value: 'otro', label: 'Otro' },
]

export const PARK_TYPES = [
  { value: 'infantil', label: 'Parque Infantil' },
  { value: 'biosaludable', label: 'Circuito Biosaludable' },
  { value: 'canino', label: 'Circuito Canino' },
  { value: 'deportivo', label: 'Espacio Deportivo' },
  { value: 'mixto', label: 'Mixto' },
]

export const LEAD_SOURCES = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referido', label: 'Referido' },
  { value: 'visita_directa', label: 'Visita Directa' },
  { value: 'red_social', label: 'Red Social' },
  { value: 'otro', label: 'Otro' },
]

export const PIPELINE_STAGES = [
  { slug: 'lead_nuevo', name: 'Lead Nuevo', color: '#6B7280', order: 1 },
  { slug: 'diagnostico', name: 'Diagnóstico', color: '#3B82F6', order: 2 },
  { slug: 'diseno_cotizacion', name: 'Diseño / Cotización', color: '#8B5CF6', order: 3 },
  { slug: 'propuesta_enviada', name: 'Propuesta Enviada', color: '#EC4899', order: 4 },
  { slug: 'negociacion', name: 'Negociación', color: '#F97316', order: 5 },
  { slug: 'cierre', name: 'Cierre / Pedido', color: '#F59E0B', order: 6 },
  { slug: 'instalacion', name: 'Instalación', color: '#10B981', order: 7 },
  { slug: 'posventa', name: 'Posventa', color: '#0EA5E9', order: 8 },
  { slug: 'perdido', name: 'Perdido', color: '#EF4444', order: 9 },
]

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Llamada' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'visit', label: 'Visita' },
  { value: 'proposal', label: 'Propuesta' },
  { value: 'note', label: 'Nota' },
  { value: 'stage_change', label: 'Cambio de etapa' },
]
