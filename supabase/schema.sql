-- ============================================
-- PathApp Database Schema
-- Execute in Supabase SQL Editor
-- ============================================

-- Enable UUID extension (Supabase usually has this, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- Linked to Supabase Auth (auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. REPORTS TABLE
-- Core entity, components stored as JSONB
-- ============================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  components JSONB DEFAULT '[]'::jsonb,
  generated_by_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_components ON public.reports USING GIN (components);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. TIMELINE_STAGES TABLE
-- Ordered stages within a report
-- ============================================
CREATE TABLE public.timeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TEXT,
  end_date TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timeline_stages_report_id ON public.timeline_stages(report_id);

ALTER TABLE public.timeline_stages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. FUNNEL_LAYERS TABLE
-- Layered funnel within a report
-- ============================================
CREATE TABLE public.funnel_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value NUMERIC,
  description TEXT,
  layer_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_funnel_layers_report_id ON public.funnel_layers(report_id);

ALTER TABLE public.funnel_layers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. REVENUE_NODES TABLE
-- Tree structure via self-referencing parent_id
-- ============================================
CREATE TABLE public.revenue_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.revenue_nodes(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_revenue_nodes_report_id ON public.revenue_nodes(report_id);
CREATE INDEX idx_revenue_nodes_parent_id ON public.revenue_nodes(parent_id);

ALTER TABLE public.revenue_nodes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. PRODUCT_MATRIX_ITEMS TABLE
-- Product/service matrix within a report
-- ============================================
CREATE TABLE public.product_matrix_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  audience TEXT,
  price_range TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_matrix_items_report_id ON public.product_matrix_items(report_id);

ALTER TABLE public.product_matrix_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.timeline_stages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.funnel_layers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.revenue_nodes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.product_matrix_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- DONE! RLS is enabled, policies to be added later.
-- ============================================
