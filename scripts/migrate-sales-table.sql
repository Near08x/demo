-- Migración para actualizar la tabla sales a la estructura correcta
-- Ejecuta este script en Supabase SQL Editor

-- Verificar estructura actual
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales';

-- Agregar columnas faltantes si no existen
DO $$ 
BEGIN
  -- Agregar subtotal si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'subtotal') THEN
    ALTER TABLE sales ADD COLUMN subtotal DECIMAL(10, 2);
  END IF;

  -- Agregar tax si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'tax') THEN
    ALTER TABLE sales ADD COLUMN tax DECIMAL(10, 2);
  END IF;

  -- Agregar amount si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'amount') THEN
    ALTER TABLE sales ADD COLUMN amount DECIMAL(10, 2);
  END IF;

  -- Agregar amount_paid si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'amount_paid') THEN
    ALTER TABLE sales ADD COLUMN amount_paid DECIMAL(10, 2);
  END IF;

  -- Agregar change_returned si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'change_returned') THEN
    ALTER TABLE sales ADD COLUMN change_returned DECIMAL(10, 2);
  END IF;

  -- Agregar customer_email si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'customer_email') THEN
    ALTER TABLE sales ADD COLUMN customer_email TEXT;
  END IF;

  -- Agregar customer_name si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'sales' AND column_name = 'customer_name') THEN
    ALTER TABLE sales ADD COLUMN customer_name TEXT;
  END IF;
END $$;

-- Renombrar columnas si existen con nombres diferentes
DO $$
BEGIN
  -- Si existe total_amount, renombrar a total
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'sales' AND column_name = 'total_amount') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'sales' AND column_name = 'total') THEN
    ALTER TABLE sales RENAME COLUMN total_amount TO total;
  END IF;

  -- Si existe sale_date, no es necesario (ya tenemos created_at)
  -- Pero lo dejamos por compatibilidad
END $$;

-- Asegurar que total no sea NULL
ALTER TABLE sales ALTER COLUMN total SET NOT NULL;

-- Crear tabla sale_items si no existe
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en sale_items si no está habilitado
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Crear política para sale_items si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sale_items' AND policyname = 'Allow all on sale_items'
  ) THEN
    CREATE POLICY "Allow all on sale_items" ON sale_items FOR ALL USING (true);
  END IF;
END $$;

-- Verificar estructura final
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'sales'
ORDER BY ordinal_position;

-- Mostrar mensaje de éxito
SELECT 'Migración completada exitosamente!' as status;
