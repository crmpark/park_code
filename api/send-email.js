export const config = { runtime: 'edge' }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function renderTemplate(html, variables) {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '')
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { prospect_id, template_id, custom_subject, custom_html } = await req.json()

    if (!prospect_id) {
      return new Response(JSON.stringify({ error: 'prospect_id es obligatorio' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
    const BREVO_KEY    = process.env.BREVO_API_KEY
    const FROM_EMAIL   = process.env.FROM_EMAIL   ?? 'espaciosconbienestar@gmail.com'
    const FROM_NAME    = process.env.FROM_NAME    ?? 'BParkLife'

    // ── Obtener prospecto ─────────────────────────────────────
    const prospectRes = await fetch(
      `${SUPABASE_URL}/rest/v1/prospects?id=eq.${prospect_id}&select=*,advisor:profiles(full_name,email)`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
    )
    const [prospect] = await prospectRes.json()

    if (!prospect) {
      return new Response(JSON.stringify({ error: 'Prospecto no encontrado' }), {
        status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }
    if (!prospect.email) {
      return new Response(JSON.stringify({ error: 'El prospecto no tiene email registrado' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // ── Variables de reemplazo ────────────────────────────────
    const variables = {
      full_name:      prospect.full_name    ?? '',
      company_name:   prospect.company_name ?? '',
      city:           prospect.city         ?? '',
      park_type:      prospect.park_type    ?? '',
      advisor_name:   prospect.advisor?.full_name ?? '',
      estimated_value: prospect.estimated_value
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(prospect.estimated_value)
        : '',
    }

    let subject = custom_subject
    let htmlBody = custom_html

    // ── Resolver plantilla ────────────────────────────────────
    if (template_id) {
      const tplRes = await fetch(
        `${SUPABASE_URL}/rest/v1/email_templates?id=eq.${template_id}&select=*`,
        { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
      )
      const [template] = await tplRes.json()
      if (!template) {
        return new Response(JSON.stringify({ error: 'Plantilla no encontrada' }), {
          status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
        })
      }
      subject  = renderTemplate(template.subject,   variables)
      htmlBody = renderTemplate(template.html_body,  variables)
    }

    if (!subject || !htmlBody) {
      return new Response(JSON.stringify({ error: 'Faltan subject o html_body' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // ── Enviar con Brevo ──────────────────────────────────────
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: prospect.email, name: prospect.full_name }],
        subject,
        htmlContent: htmlBody,
      }),
    })
    const brevoData = await brevoRes.json()

    // ── Registrar en sent_emails ──────────────────────────────
    const authHeader = req.headers.get('Authorization') ?? `Bearer ${SERVICE_KEY}`
    const userId = authHeader.replace('Bearer ', '')

    await fetch(`${SUPABASE_URL}/rest/v1/sent_emails`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        prospect_id,
        template_id: template_id ?? null,
        subject,
        to_email: prospect.email,
        html_body: htmlBody,
        status: brevoRes.ok ? 'sent' : 'failed',
      }),
    })

    if (!brevoRes.ok) {
      return new Response(JSON.stringify({ error: brevoData.message ?? 'Error al enviar correo' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // ── Registrar actividad ───────────────────────────────────
    await fetch(`${SUPABASE_URL}/rest/v1/activities`, {
      method: 'POST',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        prospect_id,
        advisor_id: prospect.advisor_id,
        activity_type: 'email',
        title: `Correo enviado: ${subject}`,
        description: `Enviado a ${prospect.email}`,
      }),
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message ?? 'Error inesperado' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
}
