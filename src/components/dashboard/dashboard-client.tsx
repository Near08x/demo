
'use client';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import SummaryCard from '@/components/dashboard/summary-card';
import RecentSales from '@/components/dashboard/recent-sales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RecentClients from '@/components/dashboard/recent-clients';
import type { Product, Sale } from '@/lib/types';

export default function DashboardClient({
  products,
  sales,
}: {
  products: Product[];
  sales: Sale[];
}) {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.subtotal, 0);
  const totalSales = sales.length;
  const lowStockItems = products.filter((product) => product.stock < 10).length;
  const totalProducts = products.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          description="+20.1% from last month"
        />
        <SummaryCard
          title="Sales"
          value={`+${totalSales}`}
          icon={CreditCard}
          description="+180.1% from last month"
        />
        <SummaryCard
          title="Low Stock"
          value={`${lowStockItems}`}
          icon={Package}
          description={lowStockItems === 1 ? '1 item needs restocking' : `${lowStockItems} items need restocking`}
          variant="destructive"
        />
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Current number of unique products"
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
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentClients sales={sales} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
