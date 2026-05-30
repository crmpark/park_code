import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Reemplaza variables {{key}} en el template con los datos del prospecto
function renderTemplate(html: string, variables: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { prospect_id, template_id, custom_subject, custom_html } = await req.json()

    if (!prospect_id) {
      return new Response(JSON.stringify({ error: 'prospect_id es obligatorio' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Obtener prospecto
    const { data: prospect, error: prospectError } = await supabase
      .from('prospects')
      .select('*, advisor:profiles(full_name, email)')
      .eq('id', prospect_id)
      .single()

    if (prospectError || !prospect) {
      return new Response(JSON.stringify({ error: 'Prospecto no encontrado' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!prospect.email) {
      return new Response(JSON.stringify({ error: 'El prospecto no tiene email registrado' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Variables de reemplazo
    const variables: Record<string, string> = {
      full_name: prospect.full_name ?? '',
      company_name: prospect.company_name ?? '',
      city: prospect.city ?? '',
      park_type: prospect.park_type ?? '',
      advisor_name: prospect.advisor?.full_name ?? '',
      estimated_value: prospect.estimated_value
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(prospect.estimated_value)
        : '',
    }

    let subject = custom_subject
    let htmlBody = custom_html

    // Si se usa plantilla
    if (template_id) {
      const { data: template, error: templateError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', template_id)
        .single()

      if (templateError || !template) {
        return new Response(JSON.stringify({ error: 'Plantilla no encontrada' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      subject = renderTemplate(template.subject, variables)
      htmlBody = renderTemplate(template.html_body, variables)
    }

    if (!subject || !htmlBody) {
      return new Response(JSON.stringify({ error: 'Faltan subject o html_body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Enviar con Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: Deno.env.get('FROM_EMAIL') ?? 'Parques CMR <noreply@bparklife.com>',
        to: [prospect.email],
        subject,
        html: htmlBody,
      }),
    })

    const resendData = await resendRes.json()

    const emailStatus = resendRes.ok ? 'sent' : 'failed'

    // Registrar en sent_emails
    await supabase.from('sent_emails').insert({
      prospect_id,
      advisor_id: user.id,
      template_id: template_id ?? null,
      subject,
      to_email: prospect.email,
      html_body: htmlBody,
      status: emailStatus,
      resend_id: resendData.id ?? null,
    })

    // Registrar actividad
    await supabase.from('activities').insert({
      prospect_id,
      advisor_id: user.id,
      activity_type: 'email',
      title: `Correo enviado: ${subject}`,
      description: `Enviado a ${prospect.email}`,
    })

    if (!resendRes.ok) {
      return new Response(JSON.stringify({ error: 'Error al enviar con Resend', detail: resendData }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, resend_id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
