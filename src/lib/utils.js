import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { SECTORS, PARK_TYPES, LEAD_SOURCES, PIPELINE_STAGES } from './constants'

export function formatDate(dateString) {
  if (!dateString) return '—'
  return format(parseISO(dateString), 'dd MMM yyyy', { locale: es })
}

export function formatRelative(dateString) {
  if (!dateString) return '—'
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: es })
}

export function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value)
}

export function getSectorLabel(value) {
  return SECTORS.find((s) => s.value === value)?.label ?? value
}

export function getParkTypeLabel(value) {
  return PARK_TYPES.find((p) => p.value === value)?.label ?? value
}

export function getLeadSourceLabel(value) {
  return LEAD_SOURCES.find((s) => s.value === value)?.label ?? value
}

export function getStage(slug) {
  return PIPELINE_STAGES.find((s) => s.slug === slug)
}

export function whatsappLink(phone, message = '') {
  const clean = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${clean}${message ? `?text=${encoded}` : ''}`
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
