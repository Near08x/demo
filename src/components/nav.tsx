'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  Home,
  Landmark,
  LogOut,
  PiggyBank,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { StockChartLogo } from '@/components/stock-chart-logo';

const allMenuItems = [
  { href: '/', label: 'Dashboard', icon: Home, roles: ['admin'] },
  { href: '/pos', label: 'POS', icon: ShoppingCart, roles: ['admin', 'cashier'] },
  { href: '/inventory', label: 'Inventory', icon: Boxes, roles: ['admin', 'cashier'] },
  { href: '/clients', label: 'Clients', icon: Users, roles: ['admin'] },
  { href: '/finance', label: 'Finance', icon: PiggyBank, roles: ['admin'] },
  { href: '/loans', label: 'Loans', icon: Landmark, roles: ['admin', 'cashier'] },
];

export default function Nav() {
  const pathname = usePathname();
  const { role, logout } = useAuth();
  
  console.log('🧭 Nav component - Current role:', role);
  
  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <StockChartLogo width={120} height={120} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/settings">
                <SidebarMenuButton isActive={pathname === '/settings'} tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={logout}>
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

