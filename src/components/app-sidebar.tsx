'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  History,
  BookOpen,
  Shield,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/agents', label: 'Gestion des Agents', icon: Users },
  { href: '/missions', label: 'Gestion des Missions', icon: Briefcase },
  { href: '/history', label: 'Historique', icon: History },
  { href: '/tutorial', label: 'Tutoriel', icon: BookOpen },
];

function SidebarCollapseButton() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="w-full h-12 justify-start p-3 bg-destructive/10 text-destructive-foreground/60 hover:bg-destructive/20 hover:text-destructive-foreground rounded-lg"
      onClick={toggleSidebar}
    >
      {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
      <span className="group-data-[collapsible=icon]:hidden ml-2">{isCollapsed ? 'Ouvrir' : 'Fermer'}</span>
    </Button>
  )
}

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
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
      <SidebarFooter className="p-4">
        <SidebarCollapseButton />
      </SidebarFooter>
    </Sidebar>
  );
}
