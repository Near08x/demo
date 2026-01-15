export const revalidate = 60; // Revalidar cada 60 segundos

import { CreditCard, DollarSign, Package } from 'lucide-react';
import SummaryCard from '@/components/dashboard/summary-card';
import RecentSales from '@/components/dashboard/recent-sales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentClients from '@/components/dashboard/recent-clients';
import MainLayout from '@/components/main-layout';
import type { Product, Sale } from '@/lib/types';
import { supabase } from '@/lib/supabaseServer';

async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getSales(): Promise<Sale[]> {
  try {
    const { data: sales, error } = await supabase
      .from('sales')
      .select(`
        id,
        subtotal,
        tax,
        total,
        amount,
        amount_paid,
        change_returned,
        payment_method,
        created_at,
        customer_email,
        customer_name,
        clients ( name ),
        sale_items (
          id,
          product_id,
          quantity,
          unit_price,
          products ( name )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Normalize sales data to match Sale type
    const normalizedSales: Sale[] = (sales ?? []).map((sale: any) => ({
      id: sale.id,
      customerName: sale.customer_name || sale.clients?.name || 'General Customer',
      customerEmail: sale.customer_email || 'N/A',
      subtotal: Number(sale.subtotal || sale.total || 0),
      amount: Number(sale.amount || sale.total || 0),
      tax: Number(sale.tax || 0),
      date: sale.created_at,
      items: (sale.sale_items ?? []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price || 0),
        product_name: item.products?.name || 'Unknown Product',
      })),
    }));

    return normalizedSales;
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

export default async function DashboardTestPage() {
  const [products, sales] = await Promise.all([
    getProducts(),
    getSales(),
  ]);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amount, 0);
  const totalSales = sales.length;
  const lowStockItems = products.filter((product) => product.stock < 10).length;
  const totalProducts = products.length;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Ingresos Totales"
            value={`$${totalRevenue.toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            icon={DollarSign}
            description="+20.1% desde el mes pasado"
          />
          <SummaryCard
            title="Ventas"
            value={`+${totalSales}`}
            icon={CreditCard}
            description="+180.1% desde el mes pasado"
          />
          <SummaryCard
            title="Poco Stock"
            value={`${lowStockItems} Artículos`}
            icon={Package}
            description="Alertas para artículos que necesitan reabastecimiento"
            variant="destructive"
          />
          <SummaryCard
            title="Productos Totales"
            value={totalProducts}
            icon={Package}
            description="Número actual de productos únicos"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales sales={sales} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clientes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentClients sales={sales} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
