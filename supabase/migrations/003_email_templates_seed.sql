-- =============================================================
-- PARQUES CMR — Plantillas de correo iniciales
-- Ejecutar en Supabase SQL Editor
-- =============================================================

INSERT INTO email_templates (name, subject, html_body, variables, category, active) VALUES

-- ─────────────────────────────────────────────────────────────
-- 1. PRIMER CONTACTO / BIENVENIDA
-- ─────────────────────────────────────────────────────────────
(
  'Primer contacto B2B',
  'Transformamos espacios en valor real — BParkLife',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:''Segoe UI'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <tr><td style="background:#0D2818;padding:28px 40px;text-align:center;">
        <img src="https://crmpark.vercel.app/bparklife.png" alt="BParkLife" style="height:48px;object-fit:contain;">
        <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase;">Recreación · Bienestar · Ingeniería</p>
      </td></tr>

      <!-- HERO IMAGE -->
      <tr><td style="padding:0;line-height:0;">
        <img src="https://crmpark.vercel.app/hero.jpg" alt="Parques BParkLife" style="width:100%;max-height:280px;object-fit:cover;object-position:center;">
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:40px 40px 24px;">
        <p style="color:#52B788;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Hola, {{full_name}}</p>
        <h1 style="color:#0D2818;font-size:26px;font-weight:700;line-height:1.3;margin:0 0 16px;">Los parques ya no son un gasto —<br>son una inversión estratégica</h1>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
          Me pongo en contacto contigo porque creemos que <strong>{{company_name}}</strong> puede transformar sus espacios en una ventaja competitiva real para sus clientes, residentes o usuarios.
        </p>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
          En <strong>BParkLife · SoluParques · Aquarela</strong> llevamos más de 26 años diseñando, fabricando e instalando parques urbanos en Colombia con estándares internacionales — desde parques infantiles hasta circuitos biosaludables y caninos.
        </p>
      </td></tr>

      <!-- 3 PRODUCTOS -->
      <tr><td style="padding:0 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="33%" style="padding-right:8px;text-align:center;vertical-align:top;">
              <img src="https://crmpark.vercel.app/infantil.png" alt="Parque infantil" style="width:100%;height:110px;object-fit:cover;border-radius:12px;display:block;">
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:8px 0 2px;">Parques Infantiles</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Estimulación y seguridad</p>
            </td>
            <td width="33%" style="padding:0 4px;text-align:center;vertical-align:top;">
              <img src="https://crmpark.vercel.app/biosaludable.png" alt="Biosaludable" style="width:100%;height:110px;object-fit:cover;border-radius:12px;display:block;">
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:8px 0 2px;">Circuitos Biosaludables</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Bienestar para adultos</p>
            </td>
            <td width="33%" style="padding-left:8px;text-align:center;vertical-align:top;">
              <img src="https://crmpark.vercel.app/canino.png" alt="Canino" style="width:100%;height:110px;object-fit:cover;border-radius:12px;display:block;">
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:8px 0 2px;">Circuitos Caninos</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Pet-friendly premium</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 40px 40px;text-align:center;">
        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0 0 24px;">¿Tienen algún espacio en mente? Me encantaría conocer su proyecto y presentarles una propuesta sin costo ni compromiso.</p>
        <a href="https://wa.me/573008744506?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20BParkLife" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;">Agendar diagnóstico gratuito →</a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:24px 40px;text-align:center;">
        <img src="https://crmpark.vercel.app/logos.png" alt="BParkLife SoluParques Aquarela" style="height:32px;object-fit:contain;margin-bottom:12px;">
        <p style="color:#9CA3AF;font-size:11px;margin:0;line-height:1.6;">Este correo fue enviado por <strong>{{advisor_name}}</strong> · BParkLife Colombia<br>Si no deseas recibir más mensajes, responde a este correo.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>',
  ARRAY['full_name', 'company_name', 'advisor_name'],
  'seguimiento',
  true
),

-- ─────────────────────────────────────────────────────────────
-- 2. CONFIRMACIÓN DE DIAGNÓSTICO / REUNIÓN
-- ─────────────────────────────────────────────────────────────
(
  'Confirmación de diagnóstico',
  'Confirmado: Diagnóstico de proyecto para {{company_name}} — BParkLife',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:''Segoe UI'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <tr><td style="background:#0D2818;padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><img src="https://crmpark.vercel.app/bparklife.png" alt="BParkLife" style="height:40px;object-fit:contain;"></td>
          <td align="right"><span style="background:#52B788;color:#ffffff;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;letter-spacing:1px;">DIAGNÓSTICO AGENDADO</span></td>
        </tr></table>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:40px 40px 32px;">
        <p style="color:#52B788;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Confirmación</p>
        <h1 style="color:#0D2818;font-size:24px;font-weight:700;line-height:1.3;margin:0 0 20px;">¡Todo listo, {{full_name}}! 🎉</h1>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
          Quedamos confirmados para el diagnóstico del proyecto de <strong>{{company_name}}</strong>. Vamos a conocer su espacio y entender exactamente qué necesitan.
        </p>

        <!-- PROCESO BOX -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;border-radius:12px;padding:24px;margin-bottom:28px;">
          <tr><td>
            <p style="color:#0D2818;font-size:13px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">¿Qué haremos en el diagnóstico?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;height:28px;background:#1B4332;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;vertical-align:middle;">1</td>
                  <td style="padding-left:12px;color:#374151;font-size:13px;">Conocer el espacio disponible y sus características</td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:6px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;height:28px;background:#1B4332;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;vertical-align:middle;">2</td>
                  <td style="padding-left:12px;color:#374151;font-size:13px;">Entender el perfil de usuarios y sus necesidades</td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:6px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;height:28px;background:#1B4332;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;vertical-align:middle;">3</td>
                  <td style="padding-left:12px;color:#374151;font-size:13px;">Evaluar normativa RETEPARQUES aplicable</td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:6px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;height:28px;background:#52B788;border-radius:50%;text-align:center;color:#fff;font-size:12px;font-weight:700;vertical-align:middle;">4</td>
                  <td style="padding-left:12px;color:#374151;font-size:13px;">Presentar opciones y primeras recomendaciones</td>
                </tr></table>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0 0 8px;">Para cualquier cambio o consulta previa, no dude en escribirnos:</p>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 40px 40px;text-align:center;">
        <a href="https://wa.me/573008744506" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;margin-right:8px;">WhatsApp →</a>
        <a href="mailto:" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;">Responder correo →</a>
      </td></tr>

      <!-- IMAGEN -->
      <tr><td style="padding:0 40px 40px;">
        <img src="https://crmpark.vercel.app/instalacion.png" alt="Instalación BParkLife" style="width:100%;border-radius:12px;object-fit:cover;max-height:200px;">
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:24px 40px;text-align:center;">
        <p style="color:#9CA3AF;font-size:11px;margin:0;line-height:1.6;">Con gusto, <strong>{{advisor_name}}</strong> · BParkLife Colombia</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>',
  ARRAY['full_name', 'company_name', 'advisor_name'],
  'seguimiento',
  true
),

-- ─────────────────────────────────────────────────────────────
-- 3. ENVÍO DE COTIZACIÓN / PROPUESTA
-- ─────────────────────────────────────────────────────────────
(
  'Envío de cotización',
  'Propuesta de parque para {{company_name}} — BParkLife',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:''Segoe UI'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER VERDE -->
      <tr><td style="background:linear-gradient(135deg,#0D2818 0%,#1B4332 100%);padding:32px 40px;text-align:center;">
        <img src="https://crmpark.vercel.app/bparklife.png" alt="BParkLife" style="height:44px;object-fit:contain;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;">
        <h2 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Propuesta Comercial</h2>
        <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:6px 0 0;">Preparada especialmente para <strong style="color:#52B788;">{{company_name}}</strong></p>
      </td></tr>

      <!-- BANNER -->
      <tr><td style="padding:0;line-height:0;">
        <img src="https://crmpark.vercel.app/banner.png" alt="Tipos de parques" style="width:100%;object-fit:cover;max-height:160px;">
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:40px 40px 24px;">
        <p style="color:#0D2818;font-size:16px;font-weight:600;margin:0 0 16px;">Estimado/a {{full_name}},</p>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Es un placer presentarles la propuesta que preparamos para el proyecto de <strong>{{company_name}}</strong>. La encontrará adjunta a este correo en formato PDF.
        </p>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 28px;">
          Esta propuesta incluye especificaciones técnicas, materiales, tiempos de entrega e instalación, y está construida sobre el diagnóstico que realizamos de su espacio.
        </p>

        <!-- RESUMEN DE VALOR -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #52B788;border-radius:14px;overflow:hidden;margin-bottom:28px;">
          <tr><td style="background:#52B788;padding:14px 20px;">
            <p style="color:#ffffff;font-size:13px;font-weight:700;margin:0;text-transform:uppercase;letter-spacing:1px;">¿Qué incluye esta propuesta?</p>
          </td></tr>
          <tr><td style="padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:6px 12px 6px 0;border-right:1px solid #E5E7EB;vertical-align:top;">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px;"><span style="color:#52B788;font-weight:700;">✓</span> Diseño personalizado</p>
                  <p style="color:#374151;font-size:13px;margin:0 0 8px;"><span style="color:#52B788;font-weight:700;">✓</span> Materiales y especificaciones</p>
                  <p style="color:#374151;font-size:13px;margin:0;"><span style="color:#52B788;font-weight:700;">✓</span> Cumplimiento RETEPARQUES</p>
                </td>
                <td width="50%" style="padding:6px 0 6px 12px;vertical-align:top;">
                  <p style="color:#374151;font-size:13px;margin:0 0 8px;"><span style="color:#52B788;font-weight:700;">✓</span> Tiempos de entrega</p>
                  <p style="color:#374151;font-size:13px;margin:0 0 8px;"><span style="color:#52B788;font-weight:700;">✓</span> Instalación profesional</p>
                  <p style="color:#374151;font-size:13px;margin:0;"><span style="color:#52B788;font-weight:700;">✓</span> Garantía y posventa</p>
                </td>
              </tr>
            </table>
          </td></tr>
          <tr><td style="background:#F0F4F0;padding:14px 20px;border-top:1px solid #E5E7EB;">
            <p style="color:#374151;font-size:13px;margin:0;"><strong>Inversión estimada:</strong> <span style="color:#1B4332;font-size:16px;font-weight:700;">{{estimated_value}}</span></p>
          </td></tr>
        </table>

        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;">Quedamos atentos a sus comentarios y preguntas. Podemos agendar una videollamada para revisar la propuesta juntos cuando lo deseen.</p>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 40px 40px;text-align:center;">
        <a href="https://wa.me/573008744506?text=Hola,%20recibí%20la%20propuesta%20y%20quiero%20conversarla" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;">Conversemos la propuesta →</a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#0D2818;padding:24px 40px;text-align:center;">
        <img src="https://crmpark.vercel.app/logos.png" alt="Grupo BParkLife" style="height:28px;object-fit:contain;margin-bottom:12px;opacity:0.7;">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">{{advisor_name}} · BParkLife Colombia · +57 300 874 4506</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>',
  ARRAY['full_name', 'company_name', 'advisor_name', 'estimated_value'],
  'propuesta',
  true
),

-- ─────────────────────────────────────────────────────────────
-- 4. SEGUIMIENTO POST-PROPUESTA
-- ─────────────────────────────────────────────────────────────
(
  'Seguimiento post-propuesta',
  '{{full_name}}, ¿tienen alguna duda sobre la propuesta?',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:''Segoe UI'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER SIMPLE -->
      <tr><td style="background:#0D2818;padding:24px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><img src="https://crmpark.vercel.app/bparklife.png" alt="BParkLife" style="height:36px;object-fit:contain;"></td>
          <td align="right"><span style="color:rgba(255,255,255,0.5);font-size:11px;">Seguimiento</span></td>
        </tr></table>
      </td></tr>

      <!-- HERO PEQUEÑO -->
      <tr><td style="background:linear-gradient(135deg,#1B4332,#52B788);padding:32px 40px;text-align:center;">
        <p style="font-size:48px;margin:0 0 12px;">🌳</p>
        <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">{{full_name}}, ¿en qué podemos ayudarle?</h1>
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:40px 40px 24px;">
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Hace unos días le enviamos la propuesta para el proyecto de <strong>{{company_name}}</strong>. Queríamos hacer un seguimiento para asegurarnos de que la recibió bien y ver si tienen alguna pregunta.
        </p>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 28px;">
          Entendemos que este tipo de decisiones requieren análisis y aprobaciones internas. Estamos disponibles para <strong>ajustar la propuesta</strong>, explorar opciones de presupuesto o ampliar cualquier detalle técnico.
        </p>

        <!-- 3 OPCIONES -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="32%" style="padding-right:6px;background:#F0F4F0;border-radius:12px;padding:16px;text-align:center;vertical-align:top;">
              <p style="font-size:28px;margin:0 0 8px;">💬</p>
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:0 0 4px;">Resolver dudas</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Aclaramos cualquier punto técnico o comercial</p>
            </td>
            <td width="4%"></td>
            <td width="32%" style="background:#F0F4F0;border-radius:12px;padding:16px;text-align:center;vertical-align:top;">
              <p style="font-size:28px;margin:0 0 8px;">📐</p>
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:0 0 4px;">Ajustar propuesta</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Adaptamos diseño, materiales o presupuesto</p>
            </td>
            <td width="4%"></td>
            <td width="32%" style="background:#F0F4F0;border-radius:12px;padding:16px;text-align:center;vertical-align:top;">
              <p style="font-size:28px;margin:0 0 8px;">📞</p>
              <p style="color:#0D2818;font-size:12px;font-weight:700;margin:0 0 4px;">Llamada técnica</p>
              <p style="color:#6B7280;font-size:11px;margin:0;">Agendamos una reunión con nuestro equipo</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- IMAGEN PARQUE -->
      <tr><td style="padding:16px 40px 0;">
        <img src="https://crmpark.vercel.app/parque1.png" alt="Parque BParkLife" style="width:100%;border-radius:12px;object-fit:cover;max-height:180px;">
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:24px 40px 40px;text-align:center;">
        <a href="https://wa.me/573008744506?text=Hola,%20quiero%20retomar%20la%20propuesta%20del%20parque" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;margin-right:8px;">Escribir por WhatsApp</a>
        <a href="mailto:" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;">Responder aquí</a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 40px;text-align:center;">
        <p style="color:#9CA3AF;font-size:11px;margin:0;">{{advisor_name}} · BParkLife Colombia · Su asesor comercial</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>',
  ARRAY['full_name', 'company_name', 'advisor_name'],
  'seguimiento',
  true
),

-- ─────────────────────────────────────────────────────────────
-- 5. BIENVENIDA CLIENTE / CIERRE
-- ─────────────────────────────────────────────────────────────
(
  'Bienvenida — Cliente nuevo',
  '¡Bienvenidos a la familia BParkLife, {{company_name}}! 🌳',
  '<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F4F0;font-family:''Segoe UI'',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER CELEBRACIÓN -->
      <tr><td style="background:linear-gradient(135deg,#0D2818 0%,#1B4332 60%,#52B788 100%);padding:48px 40px;text-align:center;">
        <p style="font-size:56px;margin:0 0 16px;">🎉</p>
        <img src="https://crmpark.vercel.app/bparklife.png" alt="BParkLife" style="height:44px;object-fit:contain;margin-bottom:20px;display:block;margin-left:auto;margin-right:auto;">
        <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0;line-height:1.3;">¡Bienvenidos a la familia!</h1>
        <p style="color:rgba(255,255,255,0.75);font-size:15px;margin:8px 0 0;">{{company_name}} ya hace parte de nuestros clientes</p>
      </td></tr>

      <!-- HERO IMAGE -->
      <tr><td style="padding:0;line-height:0;">
        <img src="https://crmpark.vercel.app/hero.jpg" alt="BParkLife" style="width:100%;max-height:220px;object-fit:cover;object-position:center 30%;">
      </td></tr>

      <!-- BODY -->
      <tr><td style="padding:40px 40px 24px;">
        <p style="color:#0D2818;font-size:16px;font-weight:600;margin:0 0 16px;">{{full_name}}, ¡gracias por confiar en nosotros!</p>
        <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Estamos emocionados de comenzar este proyecto juntos. En BParkLife nos comprometemos a que cada etapa del proceso sea clara, ágil y supere sus expectativas.
        </p>

        <!-- PRÓXIMOS PASOS -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F0;border-radius:14px;padding:24px;margin-bottom:28px;">
          <tr><td>
            <p style="color:#0D2818;font-size:13px;font-weight:700;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">🗺 Próximos pasos</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:32px;height:32px;background:#52B788;border-radius:50%;text-align:center;color:#fff;font-size:14px;vertical-align:middle;">→</td>
                  <td style="padding-left:14px;"><p style="color:#374151;font-size:13px;margin:0;"><strong>Fabricación</strong> — Iniciamos producción según especificaciones acordadas</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:32px;height:32px;background:#52B788;border-radius:50%;text-align:center;color:#fff;font-size:14px;vertical-align:middle;">→</td>
                  <td style="padding-left:14px;"><p style="color:#374151;font-size:13px;margin:0;"><strong>Seguimiento</strong> — Les mantenemos informados del avance</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:10px 0;border-bottom:1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:32px;height:32px;background:#1B4332;border-radius:50%;text-align:center;color:#fff;font-size:14px;vertical-align:middle;">→</td>
                  <td style="padding-left:14px;"><p style="color:#374151;font-size:13px;margin:0;"><strong>Instalación</strong> — Equipo profesional garantiza calidad</p></td>
                </tr></table>
              </td></tr>
              <tr><td style="padding:10px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:32px;height:32px;background:#1B4332;border-radius:50%;text-align:center;color:#fff;font-size:14px;vertical-align:middle;">✓</td>
                  <td style="padding-left:14px;"><p style="color:#374151;font-size:13px;margin:0;"><strong>Entrega y posventa</strong> — Acompañamiento continuo post-instalación</p></td>
                </tr></table>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;">Cualquier duda en el camino, <strong>{{advisor_name}}</strong> es su punto de contacto directo. Estamos aquí para garantizar que este proyecto sea exactamente lo que imaginaron.</p>
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 40px 40px;text-align:center;">
        <a href="https://wa.me/573008744506" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:14px;font-weight:700;">Hablar con mi asesor →</a>
      </td></tr>

      <!-- LOGOS FOOTER -->
      <tr><td style="background:#0D2818;padding:28px 40px;text-align:center;">
        <img src="https://crmpark.vercel.app/logos.png" alt="Grupo BParkLife" style="height:32px;object-fit:contain;opacity:0.6;margin-bottom:12px;">
        <p style="color:rgba(255,255,255,0.35);font-size:11px;margin:0;">BParkLife · SoluParques · Aquarela Parques · Colombia</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>',
  ARRAY['full_name', 'company_name', 'advisor_name'],
  'cierre',
  true
);
