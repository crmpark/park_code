export const config = { runtime: 'edge' }

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const { to_email, to_name, subject, html } = await req.json()

    if (!to_email || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const BREVO_KEY   = process.env.VITE_BREVO_API_KEY
    const REPLY_EMAIL = process.env.VITE_FROM_EMAIL ?? 'espaciosconbienestar@gmail.com'
    const FROM_NAME   = process.env.VITE_FROM_NAME  ?? 'BParkLife'

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender:      { name: FROM_NAME, email: REPLY_EMAIL },
        to:          [{ email: to_email, name: to_name ?? to_email }],
        replyTo:     { email: REPLY_EMAIL, name: FROM_NAME },
        subject,
        htmlContent: html,
        headers: {
          'X-Mailer': 'BParkLife CRM',
        },
      }),
    })

    const brevoData = await brevoRes.json()

    if (!brevoRes.ok) {
      return new Response(JSON.stringify({ error: brevoData.message ?? 'Error de Brevo' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message ?? 'Error inesperado' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
}
