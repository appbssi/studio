import AppSidebar from '@/components/app-sidebar';
import { DataProvider } from '@/contexts/data-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SidebarProvider>
        <div className="flex h-full">
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
}
