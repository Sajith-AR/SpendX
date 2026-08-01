-- PROFILES
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL DEFAULT '',
  default_currency      TEXT NOT NULL DEFAULT 'INR',
  date_format           TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
  theme                 TEXT NOT NULL DEFAULT 'dark',
  default_owner         TEXT NOT NULL DEFAULT 'Me',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACCOUNT OWNERS
CREATE TABLE public.account_owners (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Family',
  color        TEXT NOT NULL DEFAULT '#3B82F6',
  is_system    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner          TEXT NOT NULL DEFAULT 'Me',
  type           TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount         NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  category       TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  date           DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX transactions_user_date_idx  ON public.transactions (user_id, date DESC);
CREATE INDEX transactions_user_owner_idx ON public.transactions (user_id, owner);
CREATE INDEX transactions_user_type_idx  ON public.transactions (user_id, type);

-- BUDGETS
CREATE TABLE public.budgets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category   TEXT NOT NULL,
  amount     NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  month      SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year       SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category, month, year)
);

-- GOALS
CREATE TABLE public.goals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  target_amount  NUMERIC(14, 2) NOT NULL CHECK (target_amount >= 0),
  current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  deadline       DATE,
  category       TEXT DEFAULT 'General',
  icon           TEXT DEFAULT 'Target',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BILLS
CREATE TABLE public.bills (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  amount     NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  due_date   DATE NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Bills',
  recurring  TEXT NOT NULL DEFAULT 'monthly' CHECK (recurring IN ('none','monthly','quarterly','yearly')),
  owner      TEXT NOT NULL DEFAULT 'Me',
  status     TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','paid','overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('budget_warning','bill_due','goal_reached','large_expense','info')),
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated_at       BEFORE UPDATE ON public.profiles       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_account_owners_updated_at BEFORE UPDATE ON public.account_owners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_transactions_updated_at   BEFORE UPDATE ON public.transactions   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_budgets_updated_at        BEFORE UPDATE ON public.budgets        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_goals_updated_at          BEFORE UPDATE ON public.goals          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bills_updated_at          BEFORE UPDATE ON public.bills          FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile + default owners on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));

  INSERT INTO public.account_owners (user_id, name, relationship, color, is_system) VALUES
    (NEW.id, 'Me',     'Me',     '#14F195', TRUE),
    (NEW.id, 'Father', 'Father', '#3B82F6', TRUE),
    (NEW.id, 'Mother', 'Mother', '#8B5CF6', TRUE),
    (NEW.id, 'Family', 'Family', '#F59E0B', TRUE);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: owner access"       ON public.profiles       FOR ALL USING (auth.uid() = id)      WITH CHECK (auth.uid() = id);
CREATE POLICY "account_owners: owner access" ON public.account_owners FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "transactions: owner access"   ON public.transactions   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "budgets: owner access"        ON public.budgets        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "goals: owner access"          ON public.goals          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bills: owner access"          ON public.bills          FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications: owner access"  ON public.notifications  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);;
