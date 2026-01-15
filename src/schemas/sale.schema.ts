import { z } from 'zod';

// =========================
//    SALE DETAIL VALIDATION
// =========================

export const saleDetailSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  unitPrice: z.number().nonnegative('Unit price cannot be negative'),
  price: z.number().nonnegative('Price cannot be negative'),
  total: z.number().nonnegative('Total cannot be negative'),
});

// =========================
//    SALES VALIDATION
// =========================

export const saleSchema = z.object({
  id: z.string().uuid().optional(),
  customerName: z.string().min(1, 'Customer name is required').max(255),
  customerEmail: z.string().email('Invalid email'),
  subtotal: z.number().nonnegative('Subtotal cannot be negative'),
  amount: z.number().nonnegative('Amount cannot be negative'),
  tax: z.number().nonnegative('Tax cannot be negative'),
  date: z.string(),
  items: z.array(saleDetailSchema).min(1, 'There must be at least one product in the sale'),
});

// =========================
//    SCHEMAS PARA API
// =========================

// Create sale (required fields)
export const createSaleSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(255),
  customerEmail: z.string().email('Invalid email'),
  items: z.array(saleDetailSchema).min(1, 'There must be at least one product in the sale'),
  // Totals will be calculated automatically on the server
}).refine(
  (data) => {
    // Validar que todos los items tengan valores coherentes
    return data.items.every((item) => {
      const calculatedTotal = item.quantity * item.price;
      // Permitir pequeña diferencia por redondeo (0.01)
      return Math.abs(calculatedTotal - item.total) < 0.01;
    });
  },
  {
    message: 'Item totals do not match quantity * price',
  }
);

// Update sale (status/date only)
export const updateSaleSchema = z.object({
  id: z.string().uuid('Invalid sale ID'),
  date: z.string().optional(),
});

// Find sale by ID
export const getSaleByIdSchema = z.object({
  id: z.string().uuid('Invalid sale ID'),
});

// Find sales by date range
export const salesByDateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

// Tipos inferidos
export type SaleDetailInput = z.infer<typeof saleDetailSchema>;
export type SaleInput = z.infer<typeof saleSchema>;
export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
export type SaleIdInput = z.infer<typeof saleIdSchema>;
export type SalesByDateRangeInput = z.infer<typeof salesByDateRangeSchema>;
