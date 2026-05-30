-- =============================================================
-- PARQUES CMR — Módulo de correos
-- Ejecutar en Supabase SQL Editor
-- =============================================================

-- ----------------------------------------------------------------
-- 1. EMAIL_TEMPLATES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_templates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  subject      TEXT NOT NULL,
  html_body    TEXT NOT NULL,
  -- Variables disponibles: {{full_name}}, {{company_name}}, {{city}},
  --                        {{park_type}}, {{advisor_name}}, {{estimated_value}}
  variables    TEXT[] DEFAULT '{}',
  category     TEXT DEFAULT 'general' CHECK (category IN ('general', 'seguimiento', 'propuesta', 'cierre', 'posventa')),
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_by   UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 2. SENT_EMAILS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sent_emails (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id  UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  advisor_id   UUID NOT NULL REFERENCES profiles(id),
  template_id  UUID REFERENCES email_templates(id),
  subject      TEXT NOT NULL,
  to_email     TEXT NOT NULL,
  html_body    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  resend_id    TEXT,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 3. RLS
-- ----------------------------------------------------------------
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- TEMPLATES: todos los autenticados pueden leer
CREATE POLICY "templates_select_authenticated" ON email_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- TEMPLATES: solo admin puede crear/editar/borrar
CREATE POLICY "templates_insert_admin" ON email_templates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "templates_update_admin" ON email_templates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "templates_delete_admin" ON email_templates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SENT_EMAILS: asesor ve los suyos, admin ve todos
CREATE POLICY "sent_emails_select" ON sent_emails
  FOR SELECT USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "sent_emails_insert" ON sent_emails
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

-- ----------------------------------------------------------------
-- 4. ÍNDICES
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sent_emails_prospect ON sent_emails(prospect_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_advisor ON sent_emails(advisor_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(active);

-- ----------------------------------------------------------------
-- 5. PLANTILLAS SEMILLA (3 plantillas base)
-- ----------------------------------------------------------------
-- Se insertan después de tener el primer admin creado.
-- Reemplaza 'UUID_DEL_ADMIN' con el UUID real.
-- INSERT INTO email_templates (name, subject, html_body, variables, category, created_by)
-- VALUES (...) -- ver abajo
