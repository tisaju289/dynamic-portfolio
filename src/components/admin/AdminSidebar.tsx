import { Home, User, Briefcase, FolderOpen, MessageSquare, Mail, Share2, Settings, LogOut, BarChart3, FileText, Menu, ExternalLink } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const links = [
  { to: "/admin", icon: Home, label: "Dashboard", end: true },
  { to: "/admin/hero", icon: User, label: "Hero Section" },
  { to: "/admin/about", icon: User, label: "About" },
  { to: "/admin/stats", icon: BarChart3, label: "Stats / Counters" },
  { to: "/admin/services", icon: Briefcase, label: "Services" },
  { to: "/admin/portfolio", icon: FolderOpen, label: "Portfolio" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/blog", icon: FileText, label: "Blog" },
  { to: "/admin/contact", icon: Mail, label: "Contact Messages" },
  { to: "/admin/social", icon: Share2, label: "Social Links" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const SidebarNav = ({ onNavigate, username }: { onNavigate?: () => void; username?: string }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const visitUrl = username ? `/${username}` : "/";

  return (
    <>
      {/* Visit Site button */}
      <div className="px-4 pt-4">
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Site
        </a>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <link.icon className="w-4 h-4 flex-shrink-0" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );
};

const AdminSidebar = () => {
  const { data: settings } = useSiteSettings();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["admin_profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase.from("profiles").select("username").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border flex items-center gap-3 px-4 py-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="text-lg font-bold text-heading text-left">Admin Panel</SheetTitle>
              <p className="text-xs text-muted-foreground">{settings?.site_name || "MK Kopil"} Portfolio</p>
            </SheetHeader>
            <SidebarNav onNavigate={() => setOpen(false)} username={profile?.username} />
          </SheetContent>
        </Sheet>
        <h2 className="text-sm font-bold text-heading">Admin Panel</h2>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-card border-r border-border flex-col flex-shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold text-heading">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">{settings?.site_name || "MK Kopil"} Portfolio</p>
        </div>
        <SidebarNav username={profile?.username} />
      </aside>
    </>
  );
};

export default AdminSidebar;
