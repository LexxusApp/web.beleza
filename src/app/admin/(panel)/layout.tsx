import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isAdmin } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/produtos", label: "Produtos", icon: "M20 7l-8-4-8 4v10l8 4 8-4V7z" },
  { href: "/admin/categorias", label: "Categorias", icon: "M4 6h16M4 12h16M4 18h16" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "M9 5h6l2 4v10H7V9l2-4z" },
  { href: "/admin/admins", label: "Admins", icon: "M16 14a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  const admin = await isAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex flex-col lg:flex-row">
        <aside className="border-b border-ink/10 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center justify-between px-6 lg:h-20">
            <Link href="/admin" className="font-display text-xl tracking-[0.2em]">
              LUMIÈRE
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-gold">Admin</span>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 no-scrollbar lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[48px] shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink/70 transition-colors hover:bg-blush hover:text-ink"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden border-t border-ink/10 p-4 lg:block">
            <p className="truncate text-xs text-ink/50">{user.email}</p>
            <LogoutButton />
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 lg:hidden">
            <span className="truncate text-xs text-ink/50">{user.email}</span>
            <LogoutButton />
          </header>
          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
