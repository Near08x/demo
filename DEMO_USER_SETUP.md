# Configuración del Usuario Demo

## Problema
El usuario `demo@example.com` no tiene privilegios para ver los módulos de la aplicación.

## Solución

### Opción 1: Crear el usuario manualmente en Supabase (RECOMENDADO)

1. Ve a tu proyecto de Supabase: https://pgslaycjbnijwducaore.supabase.co
2. Navega a **Authentication** > **Users**
3. Click en **Add user** > **Create new user**
4. Ingresa:
   - **Email**: `demo@example.com`
   - **Password**: `DemoPassword123`
   - **Auto Confirm User**: ✅ (activado)
5. Click en **Create user**

El código ya está configurado para asignar automáticamente el rol de `admin` al usuario `demo@example.com`.

### Opción 2: Ejecutar el script SQL (Avanzado)

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido de `scripts/create-demo-user.sql`
3. Ejecuta el script
4. Esto creará la tabla `profiles` y configurará el trigger automático

**NOTA**: Aún así necesitarás crear el usuario en Authentication > Users como se describe en la Opción 1.

## Verificación

Después de crear el usuario:

1. Abre la aplicación en el navegador
2. Inicia sesión con:
   - Email: `demo@example.com`
   - Password: `DemoPassword123`
3. Deberías ver todos los módulos en el menú lateral:
   - Tablero
   - POS
   - Inventario
   - Clientes
   - Finanzas
   - Préstamos
   - Configuración

## Cómo funciona

El sistema ahora:
1. Autentica al usuario usando Supabase Auth
2. Verifica si el email es `demo@example.com`
3. Si es el usuario demo, automáticamente le asigna rol `admin`
4. Para otros usuarios, intenta obtener el rol de la tabla `profiles`
5. Si no encuentra el rol, usa `admin` como valor por defecto

## Troubleshooting

Si después de crear el usuario aún no ves los módulos:

1. **Cierra sesión** y vuelve a iniciar sesión
2. Abre la consola del navegador (F12) y verifica:
   ```javascript
   localStorage.getItem('app_role')
   ```
   Debería mostrar `"admin"`
3. Si muestra otro valor, ejecuta:
   ```javascript
   localStorage.clear()
   ```
   Y vuelve a iniciar sesión

## Archivos modificados

- `src/app/api/auth/login/route.ts` - Asigna rol automáticamente al usuario demo
- `scripts/create-demo-user.sql` - Script SQL para crear tabla profiles (opcional)
