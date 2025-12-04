import IconSidebar from '@/components/IconSidebar';
import ClientSidebar from '@/components/ClientSidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <IconSidebar />
      <ClientSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
