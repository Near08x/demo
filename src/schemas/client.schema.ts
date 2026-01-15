import { z } from 'zod';

// =========================
//    VALIDACIÓN DE CLIENTES
// =========================

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono inválido').max(20, 'Teléfono demasiado largo'),
});

// =========================
//    SCHEMAS PARA API
// =========================

// Create client (required fields)
export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Invalid phone').max(20),
});

// Update client (all optional except id)
export const updateClientSchema = z.object({
  id: z.string().uuid('Invalid client ID'),
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
});

// Find client by ID
export const getClientByIdSchema = z.object({
  id: z.string().uuid('Invalid client ID'),
});

// Tipos inferidos
export type ClientInput = z.infer<typeof clientSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientIdInput = z.infer<typeof clientIdSchema>;
