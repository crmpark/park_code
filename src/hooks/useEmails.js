import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useEmailTemplates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    setLoading(true)
    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .eq('active', true)
      .order('name')
    setTemplates(data ?? [])
    setLoading(false)
  }

  async function createTemplate(data) {
    const { data: created, error } = await supabase
      .from('email_templates')
      .insert(data)
      .select()
      .single()
    if (!error) setTemplates((prev) => [...prev, created])
    return { data: created, error }
  }

  async function updateTemplate(id, data) {
    const { data: updated, error } = await supabase
      .from('email_templates')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!error) setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return { data: updated, error }
  }

  async function deleteTemplate(id) {
    const { error } = await supabase
      .from('email_templates')
      .update({ active: false })
      .eq('id', id)
    if (!error) setTemplates((prev) => prev.filter((t) => t.id !== id))
    return { error }
  }

  return { templates, loading, createTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates }
}

export function useSentEmails(prospectId = null) {
  const { profile, isAdmin } = useAuth()
  const [sentEmails, setSentEmails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSentEmails() }, [prospectId])

  async function fetchSentEmails() {
    setLoading(true)
    let query = supabase
      .from('sent_emails')
      .select('*, template:email_templates(name), advisor:profiles(full_name)')
      .order('sent_at', { ascending: false })

    if (prospectId) query = query.eq('prospect_id', prospectId)
    else if (!isAdmin) query = query.eq('advisor_id', profile?.id)

    const { data } = await query
    setSentEmails(data ?? [])
    setLoading(false)
  }

  return { sentEmails, loading, refetch: fetchSentEmails }
}

export function useSendEmail() {
  const [sending, setSending] = useState(false)

  async function sendEmail({ prospect_id, template_id, custom_subject, custom_html, prospect, advisorId }) {
    setSending(true)
    try {
      const BREVO_KEY  = import.meta.env.VITE_BREVO_API_KEY
      const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL ?? 'espaciosconbienestar@gmail.com'
      const FROM_NAME  = import.meta.env.VITE_FROM_NAME  ?? 'BParkLife'

      // Enviar via Brevo directamente desde el navegador
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: prospect.email, name: prospect.full_name }],
          subject: custom_subject,
          htmlContent: custom_html,
        }),
      })

      const brevoData = await brevoRes.json()

      if (!brevoRes.ok) {
        return { data: null, error: brevoData.message ?? 'Error al enviar correo' }
      }

      // Registrar en sent_emails
      await supabase.from('sent_emails').insert({
        prospect_id,
        advisor_id: advisorId,
        template_id: template_id ?? null,
        subject: custom_subject,
        to_email: prospect.email,
        html_body: custom_html,
        status: 'sent',
      })

      // Registrar actividad
      await supabase.from('activities').insert({
        prospect_id,
        advisor_id: advisorId,
        activity_type: 'email',
        title: `Correo enviado: ${custom_subject}`,
        description: `Enviado a ${prospect.email}`,
      })

      return { data: brevoData, error: null }
    } catch (err) {
      return { data: null, error: err.message ?? 'Error de conexión' }
    } finally {
      setSending(false)
    }
  }

  return { sendEmail, sending }
}
