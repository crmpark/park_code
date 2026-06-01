-- =============================================================
-- PARQUES CMR — Módulo WhatsApp
-- =============================================================

CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  stage_slug   TEXT NOT NULL,
  message_body TEXT NOT NULL,
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Todos los autenticados pueden leer
CREATE POLICY "whatsapp_templates_select" ON whatsapp_templates
  FOR SELECT TO authenticated USING (true);

-- Solo admin puede crear/editar/eliminar
CREATE POLICY "whatsapp_templates_insert" ON whatsapp_templates
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "whatsapp_templates_update" ON whatsapp_templates
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "whatsapp_templates_delete" ON whatsapp_templates
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
