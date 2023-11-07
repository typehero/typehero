import { SidebarNav } from './_components/side-nav';

const sidebarNavItems = [
  {
    title: 'Reports',
    href: '/dashboard/reports',
  },
  {
    title: 'Users',
    href: '/dashboard/users',
  },
  {
    title: 'Images',
    href: '/dashboard/images',
  },
  {
    title: 'Tracks',
    href: '/dashboard/tracks',
  },
];
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex gap-7 px-4">
      <aside className="-mx-4 lg:w-1/5">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <div className="flex-1">{children}</div>
    </main>
  );
}
