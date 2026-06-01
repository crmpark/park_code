/**
 * Mensajes de WhatsApp por etapa del pipeline — Parques CMR
 * Fallback hardcodeado cuando no hay plantillas en la BD.
 */
export const WHATSAPP_MESSAGES = {
  lead_nuevo: [
    {
      label: 'Presentación inicial',
      getMessage: (name, company) =>
        `¡Hola ${name}! 👋 Mi nombre es de BParkLife, empresa colombiana con más de 26 años diseñando y fabricando parques urbanos.\n\n` +
        `Vi que ${company || 'su organización'} podría estar interesada en renovar o crear nuevos espacios de recreación. ¿Tendrían unos minutos para una breve conversación?`,
    },
    {
      label: 'Contacto directo',
      getMessage: (name) =>
        `Hola ${name}, buen día. Me comunico de BParkLife · SoluParques. ` +
        `Nos especializamos en parques infantiles, circuitos biosaludables y caninos para conjuntos, colegios, hospitales y municipios.\n\n` +
        `¿Podemos agendar un diagnóstico gratuito de su espacio?`,
    },
  ],
  diagnostico: [
    {
      label: 'Confirmar visita',
      getMessage: (name, company) =>
        `¡Hola ${name}! Confirmamos nuestra visita de diagnóstico a ${company || 'sus instalaciones'}. ` +
        `Llevaremos toda la información necesaria para hacerles una propuesta ajustada a su espacio y presupuesto. ¡Nos vemos pronto! 🌳`,
    },
    {
      label: 'Recordatorio visita',
      getMessage: (name) =>
        `Hola ${name}, un recordatorio amistoso de nuestra visita programada. ` +
        `¿Todo confirmado de su lado? Si necesita reprogramar, con gusto lo hacemos.`,
    },
  ],
  diseno_cotizacion: [
    {
      label: 'Avance del diseño',
      getMessage: (name, company) =>
        `¡Hola ${name}! Estamos trabajando en el diseño y la cotización para ${company || 'su proyecto'}. ` +
        `En los próximos días les enviaremos la propuesta con renders y especificaciones técnicas. ¿Tienen alguna preferencia de equipos o colores?`,
    },
  ],
  propuesta_enviada: [
    {
      label: 'Confirmar recibo',
      getMessage: (name) =>
        `Hola ${name}, les enviamos la propuesta y cotización para su proyecto. ` +
        `¿La recibieron bien? Con gusto agendamos una llamada para revisarla juntos.`,
    },
    {
      label: 'Seguimiento propuesta',
      getMessage: (name, company) =>
        `Hola ${name}, seguimiento a la propuesta que enviamos para ${company || 'su proyecto'}. ` +
        `Entendemos que estas decisiones requieren análisis interno. ¿Tienen alguna pregunta o ajuste que necesiten? Estamos disponibles para modificar presupuesto o alcance.`,
    },
  ],
  negociacion: [
    {
      label: 'Facilitar decisión',
      getMessage: (name) =>
        `Hola ${name}, ¿cómo van con la revisión de la propuesta? ` +
        `Si hay aspectos a ajustar — presupuesto, materiales, cronograma — conversémoslos. Nuestro objetivo es que el proyecto se haga realidad 🌳`,
    },
    {
      label: 'Opciones de financiación',
      getMessage: (name) =>
        `Hola ${name}, para facilitar la decisión, también contamos con opciones de pago fraccionado. ` +
        `¿Les gustaría conocer los esquemas disponibles?`,
    },
  ],
  cierre: [
    {
      label: 'Confirmar cierre',
      getMessage: (name, company) =>
        `¡Excelente noticia, ${name}! Confirmamos el pedido para ${company || 'su proyecto'}. ` +
        `Muy pronto iniciamos el proceso de producción. Les mantendré informados en cada etapa. ¡Gracias por confiar en BParkLife! 🎉`,
    },
  ],
  instalacion: [
    {
      label: 'Actualización de obra',
      getMessage: (name) =>
        `Hola ${name}, buenas noticias: la producción de su parque está en proceso. ` +
        `Les compartiremos fotos del avance próximamente. ¿Hay algo especial que necesitemos coordinar para la instalación?`,
    },
    {
      label: 'Coordinar instalación',
      getMessage: (name, company) =>
        `Hola ${name}, estamos listos para coordinar la fecha de instalación en ${company || 'sus instalaciones'}. ` +
        `¿Cuándo sería el mejor momento para el equipo técnico?`,
    },
  ],
  posventa: [
    {
      label: 'Seguimiento posventa',
      getMessage: (name) =>
        `¡Hola ${name}! Esperamos que el parque esté generando mucha alegría. ` +
        `¿Todo funcionando bien? Si necesitan mantenimiento, piezas de repuesto o ajustes, estamos a su disposición.`,
    },
    {
      label: 'Solicitar referido',
      getMessage: (name) =>
        `Hola ${name}, ¡qué bueno saber que el proyecto quedó excelente! ` +
        `Si conocen otra organización que pueda beneficiarse de un parque urbano, con mucho gusto les atendemos. ¡Gracias por su confianza! 🌳`,
    },
  ],
}

/**
 * Retorna los mensajes para una etapa específica.
 */
export function getStageMessages(stageSlug) {
  return WHATSAPP_MESSAGES[stageSlug] || WHATSAPP_MESSAGES['lead_nuevo']
}

/**
 * Retorna el mensaje por defecto para una etapa.
 */
export function getDefaultStageMessage(stageSlug, prospectName, companyName) {
  const msgs = getStageMessages(stageSlug)
  if (!msgs.length) return `¡Hola ${prospectName}! Te contacto de BParkLife.`
  return msgs[0].getMessage(prospectName?.split(' ')[0] || prospectName, companyName)
}
