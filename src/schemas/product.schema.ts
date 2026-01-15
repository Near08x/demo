import { z } from 'zod';

// =========================
//    VALIDACIÓN DE PRODUCTOS
// =========================

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().max(1000, 'Descripción demasiado larga'),
  price: z.number().nonnegative('El precio no puede ser negativo'),
  price2: z.number().nonnegative('El precio 2 no puede ser negativo'),
  price3: z.number().nonnegative('El precio 3 no puede ser negativo'),
  cost: z.number().nonnegative('El costo no puede ser negativo'),
  provider: z.string().max(255),
  stock: z.number().int().nonnegative('El stock no puede ser negativo'),
});

// =========================
//    SCHEMAS PARA API
// =========================

// Crear producto (campos requeridos)
export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  description: z.string().max(1000).default(''),
  price: z.number().nonnegative('El precio debe ser mayor o igual a 0'),
  price2: z.number().nonnegative().default(0),
  price3: z.number().nonnegative().default(0),
  cost: z.number().nonnegative('El costo debe ser mayor o igual a 0'),
  provider: z.string().max(255).default(''),
  stock: z.number().int().nonnegative('El stock debe ser mayor o igual a 0').default(0),
});

// Update product (all optional except id)
export const updateProductSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().nonnegative().optional(),
  price2: z.number().nonnegative().optional(),
  price3: z.number().nonnegative().optional(),
  cost: z.number().nonnegative().optional(),
  provider: z.string().max(255).optional(),
  stock: z.number().int().nonnegative().optional(),
});

// Update stock
export const updateProductStockSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
  quantity: z.number().int('Quantity must be an integer'),
  operation: z.enum(['add', 'subtract', 'set']),
});

// Tipos inferidos
export type ProductInput = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
