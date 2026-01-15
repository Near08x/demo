/**
 * Loans Repository Module
 * 
 * Data access layer for loans and installments
 * All Supabase interactions happen here
 */

import { supabase } from '@/lib/supabaseServer';
import type { Loan, Installment, LoanStatus } from '@/lib/types';
import { logger } from '@/lib/logger';

// =========================
//    TIPOS DE DATOS DB
// =========================

type LoanRow = {
  id: string;
  loan_number: string;
  client_id: string | null;
  client_name?: string;
  principal: number;
  interest_rate: number;
  loan_term: number;
  loan_type: string;
  loan_date: string;
  start_date: string;
  due_date: string | null;
  amount: number;
  amount_to_pay: number;
  amount_applied: number;
  overdue_amount: number;
  late_fee: number;
  total_pending: number;
  status: string | null;
  cashier?: string;
  created_at?: string;
};

type InstallmentRow = {
  id?: number | string; // Soporta tanto integer como UUID
  loan_id: string;
  installment_number: number;
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  paid_amount: number;
  late_fee: number;
  status: string;
  payment_date: string | null;
};

// =========================
//    LOANS - READ
//    ======================

/**
 * Gets all loans with their installments from Supabase
 * 
 * Retrieves all loans sorted by creation date (descending),
 * and for each one gets its associated installments.
 * 
 * @returns Array of loans with installments mapped to application type
 * @throws Error si falla la consulta a Supabase
 * 
 * @example
 * ```typescript
 * const loans = await getAllLoans();
 * console.log(loans[0].installments); // Installments of the first loan
 * ```
 */
export async function getAllLoans(): Promise<Loan[]> {
  try {
    const { data: loansData, error: loansError } = await supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (loansError) throw loansError;
    if (!loansData) return [];

    // Get installments for each loan
    const loans: Loan[] = [];
    for (const loan of loansData) {
      const installments = await getInstallmentsByLoanId(loan.id);
      loans.push(mapLoanRowToLoan(loan, installments));
    }

    logger.info('Fetched all loans', { count: loans.length });
    return loans;
  } catch (error) {
    logger.error('Error fetching loans', { error });
    throw error;
  }
}

/**
 * Gets a loan by ID from Supabase
 * 
 * @param loanId - ID of the loan to retrieve
 * @returns Loan with its installments, or null if it doesn't exist
 * @throws Error si falla la consulta a Supabase
 * 
 * @example
 * ```typescript
 * const loan = await getLoanById('abc-123');
 * if (loan) {
 *   console.log(loan.installments.length);
 * }
 * ```
 */
export async function getLoanById(loanId: string): Promise<Loan | null> {
  try {
    const { data: loanData, error: loanError } = await supabase
      .from('loans')
      .select('*')
      .eq('id', loanId)
      .single();

    if (loanError) throw loanError;
    if (!loanData) return null;

    const installments = await getInstallmentsByLoanId(loanId);
    
    logger.info('Fetched loan by ID', { loanId });
    return mapLoanRowToLoan(loanData, installments);
  } catch (error) {
    logger.error('Error fetching loan by ID', { loanId, error });
    throw error;
  }
}

/**
 * Obtiene cuotas de un préstamo desde Supabase
 * 
 * Las cuotas se retornan ordenadas por número de cuota (ascendente).
 * 
 * @param loanId - ID del préstamo
 * @returns Array de cuotas ordenadas, o array vacío si hay error
 * 
 * @example
 * ```typescript
 * const installments = await getInstallmentsByLoanId('abc-123');
 * console.log(installments.length); // Number of installments
 * ```
 */
export async function getInstallmentsByLoanId(loanId: string): Promise<Installment[]> {
  try {
    const { data, error } = await supabase
      .from('installments')
      .select('*')
      .eq('loan_id', loanId)
      .order('installment_number', { ascending: true });

    if (error) throw error;
    
    return (data ?? []).map(mapInstallmentRowToInstallment);
  } catch (error) {
    logger.error('Error fetching installments', { loanId, error });
    return [];
  }
}

// =========================
//    LOANS - WRITE
//    ======================

/**
 * Creates a new loan in Supabase
 * 
 * @param loanData - Loan data to insert (snake_case DB format)
 * @returns Created loan ID
 * @throws Error si falla la inserción o no se retorna ID
 * 
 * @example
 * ```typescript
 * const loanId = await createLoan({
 *   loan_number: 'LOAN-123',
 *   client_id: 'abc',
 *   principal: 10000,
 *   // ... demás campos
 * });
 * console.log(loanId); // "abc-123-xyz"
 * ```
 */
export async function createLoan(loanData: Partial<LoanRow>): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('loans')
      .insert(loanData)
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('No loan created');

    logger.info('Loan created', { loanId: data.id });
    return data.id;
  } catch (error) {
    logger.error('Error creating loan', { error });
    throw error;
  }
}

/**
 * Updates a loan in Supabase
 * 
 * Solo actualiza los campos especificados en el objeto updates.
 * 
 * @param loanId - ID of the loan to update
 * @param updates - Fields to update (snake_case DB format)
 * @returns Promise<void>
 * @throws Error si falla la actualización
 * 
 * @example
 * ```typescript
 * await updateLoan('abc-123', {
 *   status: 'Pagado',
 *   total_pending: 0
 * });
 * ```
 */
export async function updateLoan(loanId: string, updates: Partial<LoanRow>): Promise<void> {
  try {
    const { error } = await supabase
      .from('loans')
      .update(updates)
      .eq('id', loanId);

    if (error) throw error;
    
    logger.info('Loan updated', { loanId });
  } catch (error) {
    logger.error('Error updating loan', { loanId, error });
    throw error;
  }
}

/**
 * Elimina un préstamo y sus cuotas de Supabase
 * 
 * ADVERTENCIA: Operación irreversible. Elimina primero las cuotas,
 * luego el préstamo (para mantener integridad referencial).
 * 
 * @param loanId - ID of the loan to delete
 * @returns Promise<void>
 * @throws Error si falla la eliminación
 * 
 * @example
 * ```typescript
 * await deleteLoan('abc-123');
 * // Loan and installments permanently deleted
 * ```
 */
export async function deleteLoan(loanId: string): Promise<void> {
  try {
    // Primero eliminar cuotas
    await deleteInstallmentsByLoanId(loanId);
    
    // Luego eliminar préstamo
    const { error } = await supabase
      .from('loans')
      .delete()
      .eq('id', loanId);

    if (error) throw error;
    
    logger.info('Loan deleted', { loanId });
  } catch (error) {
    logger.error('Error deleting loan', { loanId, error });
    throw error;
  }
}

// =========================
//    CUOTAS - WRITE
// =========================

/**
 * Crea cuotas para un préstamo en Supabase
 * 
 * Inserta múltiples cuotas en una sola operación batch.
 * 
 * @param loanId - ID del préstamo asociado
 * @param installments - Array de cuotas a insertar
 * @returns Promise<void>
 * @throws Error si falla la inserción
 * 
 * @example
 * ```typescript
 * await createInstallments('abc-123', [
 *   { installment_number: 1, due_date: '2025-02-01', principal_amount: 100, interest_amount: 10 },
 *   { installment_number: 2, due_date: '2025-03-01', principal_amount: 100, interest_amount: 10 }
 * ]);
 * ```
 */
export async function createInstallments(
  loanId: string,
  installments: Partial<InstallmentRow>[]
): Promise<void> {
  try {
    const installmentsData = installments.map(inst => {
      const principalAmount = inst.principal_amount ?? 0;
      const interestAmount = inst.interest_amount ?? 0;
      return {
        loan_id: loanId,
        installment_number: inst.installment_number!,
        due_date: inst.due_date!,
        amount: principalAmount + interestAmount, // Requerido por la tabla
        principal_amount: principalAmount,
        interest_amount: interestAmount,
        paid_amount: inst.paid_amount ?? 0,
        late_fee: inst.late_fee ?? 0,
        status: inst.status ?? 'Pendiente',
        payment_date: inst.payment_date ?? null,
      };
    });

    const { error } = await supabase
      .from('installments')
      .insert(installmentsData);

    if (error) throw error;
    
    logger.info('Installments created', { loanId, count: installments.length });
  } catch (error) {
    logger.error('Error creating installments', { loanId, error });
    throw error;
  }
}

/**
 * Actualiza una cuota en Supabase
 * 
 * @param installmentId - ID of the installment to update
 * @param updates - Fields to update (snake_case DB format)
 * @returns Promise<void>
 * @throws Error si falla la actualización
 * 
 * @example
 * ```typescript
 * await updateInstallment(123, {
 *   paid_amount: 110,
 *   status: 'Pagado',
 *   payment_date: '2025-12-30'
 * });
 * ```
 */
export async function updateInstallment(
  installmentId: number | string,
  updates: Partial<InstallmentRow>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('installments')
      .update(updates)
      .eq('id', installmentId);

    if (error) throw error;
    
    logger.info('Installment updated', { installmentId });
  } catch (error) {
    logger.error('Error updating installment', { installmentId, error });
    throw error;
  }
}

/**
 * Actualiza múltiples cuotas en Supabase
 * 
 * Ejecuta actualizaciones en secuencia para cada cuota.
 * 
 * @param updates - Array de actualizaciones { id, data }
 * @returns Promise<void>
 * @throws Error si falla alguna actualización
 * 
 * @example
 * ```typescript
 * await updateInstallments([
 *   { id: 1, data: { paid_amount: 110, status: 'Pagado' } },
 *   { id: 2, data: { paid_amount: 50, status: 'Parcial' } }
 * ]);
 * ```
 */
export async function updateInstallments(
  updates: Array<{ id: number | string; data: Partial<InstallmentRow> }>
): Promise<void> {
  try {
    for (const update of updates) {
      await updateInstallment(update.id, update.data);
    }
    
    logger.info('Multiple installments updated', { count: updates.length });
  } catch (error) {
    logger.error('Error updating installments', { error });
    throw error;
  }
}

/**
 * Elimina cuotas de un préstamo de Supabase
 * 
 * ADVERTENCIA: Operación irreversible.
 * 
 * @param loanId - ID of the loan whose installments will be deleted
 * @returns Promise<void>
 * @throws Error si falla la eliminación
 * 
 * @example
 * ```typescript
 * await deleteInstallmentsByLoanId('abc-123');
 * // Todas las cuotas del préstamo eliminadas
 * ```
 */
export async function deleteInstallmentsByLoanId(loanId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('installments')
      .delete()
      .eq('loan_id', loanId);

    if (error) throw error;
    
    logger.info('Installments deleted', { loanId });
  } catch (error) {
    logger.error('Error deleting installments', { loanId, error });
    throw error;
  }
}

// =========================
//    MAPEO DE DATOS
// =========================

/**
 * Mapea estado de préstamo de inglés (DB) a español (aplicación)
 * 
 * @param status - Estado en inglés o null
 * @returns Estado en español (Pendiente | Aprobado | Pagado | Cancelado)
 * 
 * @example
 * ```typescript
 * mapLoanStatus('pending'); // "Pendiente"
 * mapLoanStatus('approved'); // "Aprobado"
 * mapLoanStatus(null); // "Pendiente"
 * ```
 */
function mapLoanStatus(status?: string | null): LoanStatus {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'pending':
      return 'Pendiente';
    case 'approved':
      return 'Aprobado';
    case 'paid':
      return 'Pagado';
    case 'canceled':
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Pendiente';
  }
}

/**
 * Convierte LoanRow (DB formato snake_case) a Loan (aplicación camelCase)
 * 
 * Mapea todos los campos de la base de datos al formato esperado por la aplicación,
 * incluyendo campos legacy y duales (snake_case + camelCase).
 * 
 * @param row - Fila de préstamo de Supabase
 * @param installments - Cuotas ya mapeadas
 * @returns Préstamo en formato de aplicación
 * 
 * @example
 * ```typescript
 * const dbRow = { loan_number: 'LOAN-123', client_name: 'Juan', ... };
 * const loan = mapLoanRowToLoan(dbRow, []);
 * console.log(loan.loanNumber); // "LOAN-123"
 * console.log(loan.client_name); // "Juan" (campo dual)
 * ```
 */
function mapLoanRowToLoan(row: LoanRow, installments: Installment[]): Loan {
  return {
    id: row.id,
    loanNumber: row.loan_number,
    client_id: row.client_id,
    client_name: row.client_name,
    customerName: row.client_name, // alias legacy
    principal: row.principal,
    interestRate: row.interest_rate,
    loanTerm: row.loan_term,
    loanType: row.loan_type,
    loanDate: row.loan_date,
    startDate: row.start_date,
    start_date: row.start_date,
    dueDate: row.due_date,
    due_date: row.due_date,
    amount: row.amount,
    amountToPay: row.amount_to_pay,
    amountApplied: row.amount_applied,
    overdueAmount: row.overdue_amount,
    lateFee: row.late_fee,
    totalPending: row.total_pending,
    status: mapLoanStatus(row.status),
    cashier: row.cashier,
    installments,
  };
}

/**
 * Convierte InstallmentRow (DB snake_case) a Installment (aplicación camelCase)
 * 
 * Mapea campos de la base de datos manteniendo compatibilidad con campos duales.
 * 
 * @param row - Fila de cuota de Supabase
 * @returns Cuota en formato de aplicación
 * 
 * @example
 * ```typescript
 * const dbRow = { due_date: '2025-01-01', principal_amount: 100, ... };
 * const installment = mapInstallmentRowToInstallment(dbRow);
 * console.log(installment.dueDate); // "2025-01-01"
 * console.log(installment.due_date); // "2025-01-01" (campo dual)
 * ```
 */
function mapInstallmentRowToInstallment(row: InstallmentRow): Installment {
  return {
    id: row.id,
    loan_id: row.loan_id,
    installmentNumber: row.installment_number,
    due_date: row.due_date,
    dueDate: row.due_date,
    principal_amount: row.principal_amount,
    interest_amount: row.interest_amount,
    paidAmount: row.paid_amount,
    lateFee: row.late_fee,
    status: row.status as 'Pendiente' | 'Pagado' | 'Parcial' | 'Atrasado',
    payment_date: row.payment_date,
    paymentDate: row.payment_date,
  };
}
