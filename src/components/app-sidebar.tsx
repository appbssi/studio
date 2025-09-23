'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  History,
  BookOpen,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/agents', label: 'Gestion des Agents', icon: Users },
  { href: '/missions', label: 'Gestion des Missions', icon: Briefcase },
  { href: '/history', label: 'Historique', icon: History },
  { href: '/tutorial', label: 'Tutoriel', icon: BookOpen },
];

const CrocodileLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8.2 14.2c-1.3 1.2-2.9 2-4.2 2H2v-2h2c1.1 0 2.1-.6 2.8-1.5-.7-.2-1.3-.6-1.8-1.2-1.5-1.5-1.5-4.1 0-5.6 1.5-1.5 4.1-1.5 5.6 0 1.2 1.2 1.5 3 1 4.5" />
        <path d="M22 14.2c-1.3 1.2-2.9 2-4.2 2h-2v-2h2c1.1 0 2.1-.6 2.8-1.5.7-.2 1.3-.6 1.8-1.2 1.5-1.5 1.5-4.1 0-5.6-1.5-1.5-4.1-1.5-5.6 0-1.2 1.2-1.5 3-1 4.5" />
        <path d="M9.5 12.5c.3 1.2 1.2 2.2 2.5 2.5" />
        <path d="M14.5 12.5c-.3 1.2-1.2 2.2-2.5 2.5" />
        <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5h-7A3.5 3.5 0 0 0 12 15Z" />
    </svg>
);


export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CrocodileLogo className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold text-white group-data-[collapsible=icon]:hidden">
            RH-BSSI
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
