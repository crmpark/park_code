-- =============================================================
-- PARQUES CMR — Schema inicial
-- Ejecutar en Supabase SQL Editor
-- =============================================================

-- ----------------------------------------------------------------
-- 1. PROFILES (extiende auth.users)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'advisor' CHECK (role IN ('admin', 'advisor')),
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crear perfil automáticamente al registrar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'advisor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ----------------------------------------------------------------
-- 2. PROSPECTS (tabla central)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS prospects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id        UUID NOT NULL REFERENCES profiles(id),
  full_name         TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  company_name      TEXT,
  city              TEXT,
  department        TEXT,

  -- Negocio específico de parques
  sector            TEXT CHECK (sector IN (
    'gobierno', 'constructora', 'hotel_turismo', 'educacion',
    'salud', 'comercial', 'pet_friendly', 'caja_compensacion',
    'gastronomia', 'otro'
  )),
  park_type         TEXT CHECK (park_type IN (
    'infantil', 'biosaludable', 'canino', 'deportivo', 'mixto'
  )),

  -- Pipeline
  pipeline_stage    TEXT NOT NULL DEFAULT 'lead_nuevo' CHECK (pipeline_stage IN (
    'lead_nuevo', 'diagnostico', 'diseno_cotizacion',
    'propuesta_enviada', 'negociacion', 'cierre',
    'instalacion', 'posventa', 'perdido'
  )),

  -- Comercial
  estimated_value   NUMERIC,
  lead_source       TEXT CHECK (lead_source IN (
    'landing', 'whatsapp', 'referido', 'visita_directa', 'red_social', 'otro'
  )),
  next_contact_date DATE,
  notes             TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 3. ACTIVITIES (timeline de interacciones)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id    UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  advisor_id     UUID NOT NULL REFERENCES profiles(id),
  activity_type  TEXT NOT NULL CHECK (activity_type IN (
    'call', 'whatsapp', 'email', 'visit', 'proposal', 'note', 'stage_change'
  )),
  title          TEXT NOT NULL,
  description    TEXT,
  metadata       JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 4. LEAD_SUBMISSIONS (leads del landing page — sin autenticación)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lead_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      TEXT NOT NULL,
  email          TEXT,
  phone          TEXT NOT NULL,
  company_name   TEXT,
  city           TEXT,
  sector         TEXT,
  park_type      TEXT,
  message        TEXT,
  processed      BOOLEAN NOT NULL DEFAULT FALSE,
  prospect_id    UUID REFERENCES prospects(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 5. RLS (Row Level Security)
-- ----------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- PROSPECTS — select
CREATE POLICY "prospects_select_own" ON prospects
  FOR SELECT USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROSPECTS — insert
CREATE POLICY "prospects_insert_advisor" ON prospects
  FOR INSERT WITH CHECK (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROSPECTS — update
CREATE POLICY "prospects_update_own" ON prospects
  FOR UPDATE USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROSPECTS — delete (solo admin)
CREATE POLICY "prospects_delete_admin" ON prospects
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ACTIVITIES
CREATE POLICY "activities_select" ON activities
  FOR SELECT USING (
    advisor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "activities_insert" ON activities
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

-- LEAD_SUBMISSIONS — anónimos pueden insertar (desde landing)
CREATE POLICY "lead_submissions_insert_anon" ON lead_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "lead_submissions_select_admin" ON lead_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "lead_submissions_update_admin" ON lead_submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ----------------------------------------------------------------
-- 6. DATOS SEMILLA — Admin inicial
-- (Ejecutar después de crear el usuario en Authentication > Users)
-- Reemplaza 'UUID_DEL_ADMIN' con el ID real del usuario
-- ----------------------------------------------------------------
-- UPDATE profiles SET role = 'admin' WHERE id = 'UUID_DEL_ADMIN';

-- ----------------------------------------------------------------
-- 7. ÍNDICES para performance
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_prospects_advisor ON prospects(advisor_id);
CREATE INDEX IF NOT EXISTS idx_prospects_stage ON prospects(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_activities_prospect ON activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_lead_submissions_processed ON lead_submissions(processed);
