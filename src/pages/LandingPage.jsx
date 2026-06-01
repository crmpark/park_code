import { useState, useRef } from 'react'
import {
  TreePine, Phone, MessageCircle, Mail, CheckCircle,
  ChevronDown, ArrowRight, MapPin, Play, X, Menu
} from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

const PARK_TYPES = [
  { img: '/infantil.png', title: 'Parques Infantiles', desc: 'Estimulación física y social para los más pequeños. Diseños seguros, coloridos y normativos.' },
  { img: '/biosaludable.png', title: 'Circuitos Biosaludables', desc: 'Actividad y prevención para adultos mayores. Bienestar activo en espacios comunitarios.' },
  { img: '/canino.png', title: 'Circuitos Caninos', desc: 'Espacios de socialización para mascotas y sus familias. Pet-friendly de alta calidad.' },
  { img: '/urbano.jpg', title: 'Espacios Urbanos', desc: 'Diseño, construcción y adecuación de espacios de recreación y bienestar para todos.' },
]

const DIFFERENTIALS = [
  { icon: '🏆', title: '+26 años de experiencia', desc: 'Liderando el mercado de parques recreativos en Colombia.' },
  { icon: '📋', title: 'Cumplimiento normativo', desc: 'Todos nuestros productos cumplen la norma RETEPARQUES vigente.' },
  { icon: '🌱', title: 'Materiales sostenibles', desc: 'Resistentes a la intemperie, duraderos y responsables con el medio ambiente.' },
  { icon: '🎨', title: 'Diseño moderno', desc: 'Estética contemporánea integrada con la identidad visual de cada proyecto.' },
  { icon: '🔧', title: 'Servicio integral', desc: 'Del diagnóstico a la posventa, nos encargamos de todo el proceso.' },
  { icon: '🌍', title: 'Estándares internacionales', desc: 'Fabricación e importación con calidad de Brasil y estándares globales.' },
]

const SECTORS = [
  { icon: '🏛️', label: 'Alcaldías' },
  { icon: '🏗️', label: 'Constructoras' },
  { icon: '🏨', label: 'Hoteles' },
  { icon: '🏫', label: 'Colegios' },
  { icon: '🏥', label: 'Salud' },
  { icon: '🛍️', label: 'Centros Comerciales' },
  { icon: '🐕', label: 'Pet-friendly' },
  { icon: '⚽', label: 'Cajas de Compensación' },
]

const PROCESS = [
  { n: '01', title: 'Diagnóstico', desc: 'Visitamos el espacio, entendemos las necesidades y el contexto del proyecto.' },
  { n: '02', title: 'Diseño', desc: 'Creamos una propuesta visual personalizada adaptada a tu espacio y presupuesto.' },
  { n: '03', title: 'Propuesta', desc: 'Presentamos cotización detallada con materiales, tiempos y condiciones.' },
  { n: '04', title: 'Fabricación', desc: 'Producción e importación con estándares internacionales de calidad.' },
  { n: '05', title: 'Instalación', desc: 'Instalación profesional, rápida y con cumplimiento normativo garantizado.' },
  { n: '06', title: 'Posventa', desc: 'Acompañamiento post-instalación para garantizar la durabilidad del proyecto.' },
]

const WHATSAPP = '573008744506' // ← cambiar por el número real

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', city: '', sector: '', message: '' })
  const [formState, setFormState] = useState('idle') // idle | sending | success | error
  const formRef = useRef(null)

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function set(key, val) { setFormData(p => ({ ...p, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormState('sending')
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
        },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setFormState('success')
        setFormData({ full_name: '', phone: '', email: '', city: '', sector: '', message: '' })
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <img src="/bparklife.png" alt="BParkLife" className="h-10 object-contain" />
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#tipos" className="hover:text-[#1B4332] transition-colors">Productos</a>
            <a href="#sectores" className="hover:text-[#1B4332] transition-colors">Sectores</a>
            <a href="#proceso" className="hover:text-[#1B4332] transition-colors">Proceso</a>
            <a href="#contacto" className="hover:text-[#1B4332] transition-colors">Contacto</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
            <button
              onClick={scrollToForm}
              className="text-sm bg-[#1B4332] text-white px-4 py-1.5 rounded-lg hover:bg-[#145028] transition-colors"
            >
              Cotiza tu parque
            </button>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm text-gray-700">
            <a href="#tipos" className="block" onClick={() => setMenuOpen(false)}>Productos</a>
            <a href="#sectores" className="block" onClick={() => setMenuOpen(false)}>Sectores</a>
            <a href="#proceso" className="block" onClick={() => setMenuOpen(false)}>Proceso</a>
            <a href="#contacto" className="block" onClick={() => setMenuOpen(false)}>Contacto</a>
            <button onClick={() => { scrollToForm(); setMenuOpen(false) }} className="w-full bg-[#1B4332] text-white py-2 rounded-lg">
              Cotiza tu parque
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-16">
        <img src="/hero.jpg" alt="Parque" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D2818]/85 via-[#0D2818]/60 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <span className="inline-block text-[#52B788] text-sm font-semibold uppercase tracking-widest mb-4">
              BParkLife · SoluParques · Aquarela
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Los parques ya no son un gasto,{' '}
              <span className="text-[#52B788]">son una inversión</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Transformamos espacios vacíos en lugares donde familias, niños y mascotas
              crean recuerdos que duran toda la vida. +26 años liderando Colombia.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={scrollToForm}
                className="flex items-center gap-2 bg-[#52B788] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3da374] transition-colors shadow-lg"
              >
                Cotiza tu parque gratis <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setVideoOpen(true)}
                className="flex items-center gap-2 bg-white/10 text-white border border-white/30 px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors backdrop-blur"
              >
                <Play size={18} className="fill-white" /> Ver proyectos
              </button>
            </div>
          </div>
        </div>
        <a href="#tipos" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown size={28} />
        </a>
      </section>

      {/* ── LOGOS ── */}
      <section className="bg-gray-50 py-10 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Grupo empresarial</p>
          <img src="/logos.png" alt="BParkLife · SoluParques · Aquarela" className="h-16 md:h-20 object-contain mx-auto" />
        </div>
      </section>

      {/* ── TIPOS DE PARQUE ── */}
      <section id="tipos" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">Nuestros productos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Si hay personas, hay un parque para ellas</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Diseñamos y fabricamos espacios para cada tipo de comunidad, edad y necesidad.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARK_TYPES.map((p) => (
            <div key={p.title} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={scrollToForm}>
              <div className="h-52 overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                <button className="mt-4 text-[#1B4332] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Cotizar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIFERENCIADORES ── */}
      <section className="bg-[#0D2818] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">¿Por qué elegirnos?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Diferenciales competitivos</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFFERENTIALS.map((d) => (
              <div key={d.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <span className="text-3xl mb-4 block">{d.icon}</span>
                <h3 className="font-bold text-white text-lg mb-2">{d.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTORES ── */}
      <section id="sectores" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">¿A quién servimos?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Sectores que atendemos</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Donde hay personas, hay oportunidad de parque.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SECTORS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3 bg-gray-50 rounded-2xl p-6 hover:bg-green-50 hover:shadow-md transition-all duration-200 cursor-default">
              <span className="text-4xl">{s.icon}</span>
              <span className="text-sm font-semibold text-gray-700 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── VIDEO / INSTALACIÓN ── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">Nuestro trabajo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Del espacio vacío al parque que transforma
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Nos encargamos de todo el proceso: diagnóstico, diseño, fabricación, importación,
              instalación y posventa. Tu trabajo es soñar el espacio, el nuestro es construirlo.
            </p>
            <ul className="space-y-3">
              {['Materiales resistentes a la intemperie y uso intensivo', 'Cumplimiento de norma RETEPARQUES Colombia', 'Estética contemporánea y funcional', 'Garantía de durabilidad'].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-[#52B788] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => setVideoOpen(true)} className="mt-8 flex items-center gap-3 bg-[#1B4332] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#145028] transition-colors">
              <Play size={18} className="fill-white" /> Ver video de proyectos
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group" onClick={() => setVideoOpen(true)}>
            <img src="/instalacion.png" alt="Instalación de parque" className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-[#0D2818]/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play size={24} className="text-[#1B4332] fill-[#1B4332] ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section id="proceso" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">Cómo trabajamos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Nuestro proceso</h2>
          <p className="text-gray-500 mt-4">Del primer diagnóstico hasta la instalación final, acompañamos cada etapa.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS.map((p) => (
            <div key={p.n} className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-5xl font-black text-gray-50 absolute top-4 right-5 select-none">{p.n}</span>
              <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center mb-4">
                <TreePine size={20} className="text-[#52B788]" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER FOTO ── */}
      <section className="py-4 px-6 max-w-6xl mx-auto">
        <img src="/banner.png" alt="Tipos de parques" className="w-full rounded-2xl shadow-md object-cover max-h-48" />
      </section>

      {/* ── FORMULARIO CTA ── */}
      <section id="contacto" ref={formRef} className="py-20 px-6 bg-[#F0F4F0]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left: info */}
              <div className="bg-[#0D2818] p-10 flex flex-col justify-between">
                <div>
                  <span className="text-[#52B788] text-sm font-semibold uppercase tracking-widest">Cotización gratuita</span>
                  <h2 className="text-3xl font-bold text-white mt-3 mb-4">Hablemos de tu proyecto</h2>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Cuéntanos sobre tu espacio y te asesoramos sin compromiso. Nuestro equipo te
                    responde en menos de 24 horas con una propuesta personalizada.
                  </p>
                  <div className="mt-8 space-y-4">
                    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm">
                      <div className="w-9 h-9 rounded-lg bg-green-600/20 flex items-center justify-center">
                        <MessageCircle size={16} className="text-green-400" />
                      </div>
                      Escríbenos por WhatsApp
                    </a>
                    <a href="tel:+573008744506"
                      className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-sm">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Phone size={16} className="text-blue-400" />
                      </div>
                      Llámanos directamente
                    </a>
                    <div className="flex items-center gap-3 text-white/50 text-sm">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      Colombia — Atención nacional
                    </div>
                  </div>
                </div>
                <img src="/bparklife.png" alt="BParkLife" className="h-10 object-contain mt-10 opacity-60 self-start" />
              </div>

              {/* Right: form */}
              <div className="p-10">
                {formState === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">¡Mensaje enviado!</h3>
                    <p className="text-gray-500 text-sm">Te contactaremos en menos de 24 horas con una propuesta personalizada.</p>
                    <a href={`https://wa.me/${WHATSAPP}?text=Hola, acabo de enviar mi información por la web.`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-sm bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors mt-2">
                      <MessageCircle size={16} /> Escribir también por WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-xl mb-6">Cuéntanos sobre tu proyecto</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-600 block mb-1">Nombre completo *</label>
                        <input required value={formData.full_name} onChange={e => set('full_name', e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">WhatsApp / Teléfono *</label>
                        <input required value={formData.phone} onChange={e => set('phone', e.target.value)}
                          placeholder="573008744506"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Ciudad</label>
                        <input value={formData.city} onChange={e => set('city', e.target.value)}
                          placeholder="Bogotá"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
                        <input type="email" value={formData.email} onChange={e => set('email', e.target.value)}
                          placeholder="tu@email.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600 block mb-1">Tipo de organización</label>
                        <select value={formData.sector} onChange={e => set('sector', e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none bg-white">
                          <option value="">Seleccionar...</option>
                          <option value="gobierno">Alcaldía / Gobierno</option>
                          <option value="constructora">Constructora / Inmobiliaria</option>
                          <option value="hotel_turismo">Hotel / Turismo</option>
                          <option value="educacion">Colegio / Jardín</option>
                          <option value="salud">Salud / Clínica</option>
                          <option value="comercial">Centro Comercial</option>
                          <option value="pet_friendly">Pet-friendly / Veterinaria</option>
                          <option value="caja_compensacion">Caja de Compensación</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-gray-600 block mb-1">Cuéntanos de tu proyecto</label>
                        <textarea value={formData.message} onChange={e => set('message', e.target.value)}
                          rows={3} placeholder="Tamaño del espacio, tipo de parque que buscas, presupuesto aproximado..."
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1B4332] focus:border-transparent outline-none resize-none" />
                      </div>
                    </div>

                    {formState === 'error' && (
                      <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                        Hubo un error al enviar. Por favor escríbenos directamente por WhatsApp.
                      </p>
                    )}

                    <button type="submit" disabled={formState === 'sending'}
                      className="w-full bg-[#1B4332] text-white py-3 rounded-xl font-semibold hover:bg-[#145028] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                      {formState === 'sending' ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</>
                      ) : (
                        <><ArrowRight size={18} /> Solicitar cotización gratis</>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Te respondemos en menos de 24 horas · Sin compromiso
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D2818] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <img src="/logos.png" alt="Grupo BParkLife" className="h-12 object-contain mb-3" />
              <p className="text-white/40 text-xs">Recreación, Bienestar e Ingeniería · Colombia</p>
            </div>
            <div className="flex gap-4">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-green-600/30 hover:text-white transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="tel:+573008744506"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-blue-600/30 hover:text-white transition-colors">
                <Phone size={18} />
              </a>
              <a href="mailto:hola@bparklife.com"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <p>© 2025 BParkLife · SoluParques · Aquarela Parques. Todos los derechos reservados.</p>
            <a href="/login" className="hover:text-white/60 transition-colors">Acceso CRM →</a>
          </div>
        </div>
      </footer>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setVideoOpen(false)}>
            <X size={28} />
          </button>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <video controls autoPlay className="w-full rounded-xl shadow-2xl max-h-[80vh]">
              <source src="/video1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  )
}
