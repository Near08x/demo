-- Script para actualizar el schema de loans e installments
-- Este script corrige las discrepancias entre el schema actual y lo que el código espera

-- =========================================
-- TABLA LOANS - Actualizar estructura
-- =========================================

-- Agregar columnas faltantes
ALTER TABLE loans 
  ADD COLUMN IF NOT EXISTS loan_number TEXT,
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS principal DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS loan_term INTEGER,
  ADD COLUMN IF NOT EXISTS loan_type TEXT,
  ADD COLUMN IF NOT EXISTS loan_date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS amount_to_pay DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS amount_applied DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overdue_amount DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_pending DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS cashier TEXT;

-- Renombrar columnas existentes si es necesario
DO $$
BEGIN
  -- Renombrar term_months a loan_term si existe y loan_term NO existe
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'term_months') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'loans' AND column_name = 'loan_term') THEN
    ALTER TABLE loans RENAME COLUMN term_months TO loan_term;
  END IF;

  -- Renombrar payment_frequency a loan_type si existe y loan_type NO existe
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'payment_frequency') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'loans' AND column_name = 'loan_type') THEN
    ALTER TABLE loans RENAME COLUMN payment_frequency TO loan_type;
  END IF;

  -- Renombrar end_date a due_date si existe y due_date NO existe
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'end_date') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'loans' AND column_name = 'due_date') THEN
    ALTER TABLE loans RENAME COLUMN end_date TO due_date;
  END IF;

  -- Si ambas columnas existen (term_months y loan_term), copiar datos y eliminar term_months
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'term_months') 
     AND EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'loans' AND column_name = 'loan_term') THEN
    UPDATE loans SET loan_term = term_months WHERE loan_term IS NULL;
    ALTER TABLE loans DROP COLUMN term_months;
  END IF;

  -- Lo mismo para payment_frequency y loan_type
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'payment_frequency') 
     AND EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'loans' AND column_name = 'loan_type') THEN
    UPDATE loans SET loan_type = payment_frequency WHERE loan_type IS NULL;
    ALTER TABLE loans DROP COLUMN payment_frequency;
  END IF;

  -- Lo mismo para end_date y due_date
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'loans' AND column_name = 'end_date') 
     AND EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'loans' AND column_name = 'due_date') THEN
    UPDATE loans SET due_date = end_date WHERE due_date IS NULL;
    ALTER TABLE loans DROP COLUMN end_date;
  END IF;
END $$;

-- Actualizar columna amount si no es principal
UPDATE loans SET amount = principal WHERE amount IS NULL AND principal IS NOT NULL;

-- Asegurar que principal existe y no es NULL
UPDATE loans SET principal = amount WHERE principal IS NULL AND amount IS NOT NULL;

-- =========================================
-- TABLA INSTALLMENTS - Actualizar estructura  
-- =========================================

-- Agregar columnas faltantes
ALTER TABLE installments
  ADD COLUMN IF NOT EXISTS principal_amount DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS interest_amount DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS late_fee DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- Renombrar columnas si es necesario
DO $$
BEGIN
  -- Si existe 'amount', dividirlo entre principal e interés (asumiendo 85/15)
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'installments' AND column_name = 'amount') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'installments' AND column_name = 'principal_amount') THEN
    UPDATE installments SET principal_amount = amount * 0.85, interest_amount = amount * 0.15 
    WHERE principal_amount IS NULL;
  END IF;

  -- Renombrar paid_date a payment_date si existe y payment_date NO existe
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'installments' AND column_name = 'paid_date') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'installments' AND column_name = 'payment_date') THEN
    ALTER TABLE installments RENAME COLUMN paid_date TO payment_date;
  END IF;

  -- Si ambas columnas existen (paid_date y payment_date), copiar datos y eliminar paid_date
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'installments' AND column_name = 'paid_date') 
     AND EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'installments' AND column_name = 'payment_date') THEN
    UPDATE installments SET payment_date = paid_date WHERE payment_date IS NULL;
    ALTER TABLE installments DROP COLUMN paid_date;
  END IF;
END $$;

-- Actualizar estados para que coincidan con los del código
UPDATE installments SET status = 'Pendiente' WHERE status = 'pending';
UPDATE installments SET status = 'Pagado' WHERE status = 'paid';
UPDATE installments SET status = 'Atrasado' WHERE status = 'overdue';

UPDATE loans SET status = 'Pendiente' WHERE status = 'pending' OR status = 'active';
UPDATE loans SET status = 'Aprobado' WHERE status = 'approved';
UPDATE loans SET status = 'Pagado' WHERE status = 'paid' OR status = 'completed';
UPDATE loans SET status = 'Cancelado' WHERE status = 'cancelled' OR status = 'canceled';

-- Asegurar valores NOT NULL con defaults razonables
UPDATE loans SET 
  amount = COALESCE(amount, principal, 0),
  amount_to_pay = COALESCE(amount_to_pay, amount, principal, 0),
  amount_applied = COALESCE(amount_applied, 0),
  overdue_amount = COALESCE(overdue_amount, 0),
  late_fee = COALESCE(late_fee, 0),
  total_pending = COALESCE(total_pending, amount_to_pay, amount, principal, 0),
  loan_date = COALESCE(loan_date, created_at, NOW()),
  status = COALESCE(status, 'Pendiente');

UPDATE installments SET
  paid_amount = COALESCE(paid_amount, 0),
  late_fee = COALESCE(late_fee, 0),
  status = COALESCE(status, 'Pendiente');

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_loans_client_id ON loans(client_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_loan_date ON loans(loan_date);
CREATE INDEX IF NOT EXISTS idx_installments_loan_id ON installments(loan_id);
CREATE INDEX IF NOT EXISTS idx_installments_status ON installments(status);
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON installments(due_date);

-- Verificar estructura final
SELECT 
  'loans' as table_name,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'loans'
ORDER BY ordinal_position;

SELECT 
  'installments' as table_name,
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'installments'
ORDER BY ordinal_position;

SELECT 'Schema actualizado exitosamente!' as status;
