-- Script para crear el usuario demo con rol de admin
-- Ejecutar en el SQL Editor de Supabase

-- Primero, crear el usuario en auth.users si no existe
-- Nota: Esto debe hacerse manualmente en Supabase Auth Dashboard
-- Email: demo@example.com
-- Password: DemoPassword123

-- Crear la tabla profiles si no existe
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'cashier',
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para insertar perfiles (triggered automáticamente)
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'cashier'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Actualizar el rol del usuario demo a admin (si ya existe)
-- Necesitas el UUID del usuario demo de auth.users
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Buscar el usuario demo
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com';
  
  IF demo_user_id IS NOT NULL THEN
    -- Insertar o actualizar el perfil
    INSERT INTO public.profiles (id, email, role, username)
    VALUES (demo_user_id, 'demo@example.com', 'admin', 'demo')
    ON CONFLICT (id) 
    DO UPDATE SET role = 'admin', email = 'demo@example.com', username = 'demo';
    
    RAISE NOTICE 'Usuario demo actualizado a admin';
  ELSE
    RAISE NOTICE 'Usuario demo@example.com no encontrado en auth.users. Por favor créalo primero en Authentication > Users';
  END IF;
END $$;

-- Verificar
SELECT p.id, p.email, p.role, p.username, u.email as auth_email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'demo@example.com';
