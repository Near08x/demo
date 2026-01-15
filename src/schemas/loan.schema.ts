/**
 * Loan Schema Module
 * 
 * Zod validation schemas for loans and installments
 * Used in API routes to validate client inputs
 */

import { z } from 'zod';

// =========================
//    INSTALLMENT VALIDATION
//    ======================

/**
 * Valid installment states
 * - Pendiente: No ha sido pagada
 * - Pagado: Completamente pagada
 * - Parcial: Parcialmente pagada
 * - Atrasado: Vencida y no pagada
 */
export const installmentStatusSchema = z.enum([
  'Pendiente',
  'Pagado',
  'Parcial',
  'Atrasado',
]);

/**
 * Validation schema for an installment
 * 
 * Soporta campos duales (snake_case y camelCase) para compatibilidad
 * entre frontend y backend.
 * 
 * @example
 * ```typescript
 * const validInstallment = {
 *   installmentNumber: 1,
 *   dueDate: '2025-01-01',
 *   principal_amount: 100,
 *   interest_amount: 10,
 *   status: 'Pendiente'
 * };
 * installmentSchema.parse(validInstallment); // ✓
 * ```
 */
export const installmentSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  loan_id: z.string().uuid().optional(),
  installmentNumber: z.number().int().positive(),
  
  // Fechas (soporta ambos formatos)
  due_date: z.string().optional(),
  dueDate: z.string().optional(),
  
  // Montos
  principal_amount: z.number().nonnegative(),
  interest_amount: z.number().nonnegative(),
  paidAmount: z.number().nonnegative().optional().default(0),
  lateFee: z.number().nonnegative().optional().default(0),
  
  status: installmentStatusSchema,
  
  // Fecha de pago (nullable)
  payment_date: z.string().nullable().optional(),
  paymentDate: z.string().nullable().optional(),
});

// =========================
//    VALIDACIÓN DE PRÉSTAMOS
// =========================

/**
 * Estados válidos de un préstamo
 * - Pendiente: Solicitud pendiente de aprobación
 * - Aprobado: Préstamo activo
 * - Pagado: Completamente liquidado
 * - Cancelado: Rechazado o cancelado
 */
export const loanStatusSchema = z.enum([
  'Pendiente',
  'Aprobado',
  'Pagado',
  'Cancelado',
]);

/**
 * Validation schema for a complete loan
 * 
 * Includes all loan fields and their installments.
 * Soporta campos duales para compatibilidad frontend/backend.
 * 
 * @example
 * ```typescript
 * const validLoan = {
 *   loanNumber: 'LOAN-123',
 *   client_name: 'Juan Pérez',
 *   principal: 10000,
 *   interestRate: 12,
 *   loanDate: '2025-01-01',
 *   amount: 10000,
 *   amountToPay: 11200,
 *   totalPending: 11200,
 *   installments: []
 * };
 * loanSchema.parse(validLoan); // ✓
 * ```
 */
export const loanSchema = z.object({
  id: z.string().uuid().optional(),
  loanNumber: z.string().min(1, 'Loan number required'),
  client_id: z.string().uuid().nullable().optional(),
  client_name: z.string().optional(),
  customerName: z.string().optional(),
  paymentType: z.string().optional(),
  loanTerm: z.number().int().positive().optional(),
  
  // Fechas
  loanDate: z.string(),
  start_date: z.string().optional(),
  startDate: z.string().optional(),
  due_date: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  
  // Financial data
  principal: z.number().positive('Principal must be greater than 0'),
  interestRate: z.number().nonnegative('Interest rate cannot be negative').max(100, 'Invalid interest rate'),
  amount: z.number().positive('Amount must be greater than 0'),
  amountToPay: z.number().nonnegative(),
  amountApplied: z.number().nonnegative().default(0),
  overdueAmount: z.number().nonnegative().default(0),
  lateFee: z.number().nonnegative().default(0),
  change: z.number().optional(),
  totalPending: z.number().nonnegative(),
  
  // Installments
  installments: z.array(installmentSchema),
  
  // Extras
  loanType: z.string().optional(),
  invoiceNumber: z.string().optional(),
  cashier: z.string().optional(),
  status: loanStatusSchema.optional(),
});

// =========================
//    SCHEMAS PARA API
// =========================

/**
 * Schema for creating a new loan
 *
 * Validates the minimum required fields to create a loan.
 * Installments are automatically generated in the service.
 * 
 * @example
 * ```typescript
 * const input = {
 *   client_id: 'abc-123',
 *   client_name: 'Juan Pérez',
 *   principal: 10000,
 *   interestRate: 12,
 *   loanTerm: 12,
 *   loanType: 'Mensual',
 *   startDate: '2025-01-01'
 * };
 * createLoanSchema.parse(input); // ✓
 * ```
 */
export const createLoanSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  client_name: z.string().min(1, 'Client name required'),
  loanNumber: z.string().optional(),
  principal: z.number().positive('Principal must be greater than 0'),
  interestRate: z.number().nonnegative('Interest rate cannot be negative').max(100),
  amount: z.number().positive().optional(),
  amountToPay: z.number().positive().optional(),
  amountApplied: z.number().nonnegative().optional(),
  overdueAmount: z.number().nonnegative().optional(),
  lateFee: z.number().nonnegative().optional(),
  change: z.number().nonnegative().optional(),
  totalPending: z.number().nonnegative().optional(),
  loanTerm: z.number().int().positive('Loan term must be greater than 0').optional(),
  loanType: z.string().min(1, 'Loan type required').optional(),
  startDate: z.string(),
  dueDate: z.string().optional(),
  loanDate: z.string().optional(),
  status: z.string().optional(),
  installments: z.array(z.any()).optional(),
  cashier: z.string().optional(),
});

/**
 * Schema for processing a loan payment
 * 
 * Validates the data needed to apply a payment.
 * Payment is automatically distributed among pending installments.
 * 
 * @example
 * ```typescript
 * const payment = {
 *   loanId: 'abc-123',
 *   paymentAmount: 500,
 *   paymentDate: '2025-12-30' // opcional
 * };
 * processPaymentSchema.parse(payment); // ✓
 * ```
 */
export const processPaymentSchema = z.object({
  loanId: z.string().uuid('Invalid loan ID'),
  installmentId: z.string().uuid('Invalid installment ID').optional(),
  paymentAmount: z.number().positive('Payment amount must be greater than 0'),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  applyOverpaymentToPrincipal: z.boolean().optional(),
  applyToInstallments: z.array(z.number().int().positive()).optional(),
});

/**
 * Schema for updating an existing loan
 *
 * Allows updating specific loan fields.
 * Todos los campos excepto 'id' son opcionales.
 * 
 * @example
 * ```typescript
 * const update = {
 *   id: 'abc-123',
 *   status: 'Pagado',
 *   totalPending: 0
 * };
 * updateLoanSchema.parse(update); // ✓
 * ```
 */
export const updateLoanSchema = z.object({
  id: z.string().uuid('Invalid loan ID'),
  status: loanStatusSchema.optional(),
  lateFee: z.number().nonnegative().optional(),
  amountApplied: z.number().nonnegative().optional(),
  totalPending: z.number().nonnegative().optional(),
});

/**
 * Tipos TypeScript inferidos de los schemas Zod
 * 
 * - CreateLoanInput: Data for creating a loan
 * - LoanPaymentInput: Data for processing a payment
 * - UpdateLoanInput: Data for updating a loan
 * - LoanInput: Validated complete loan
 * - InstallmentInput: Cuota validada
 */
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;
export type LoanInput = z.infer<typeof loanSchema>;
export type InstallmentInput = z.infer<typeof installmentSchema>;
