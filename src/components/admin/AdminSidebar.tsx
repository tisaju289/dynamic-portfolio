import { Home, User, Briefcase, FolderOpen, MessageSquare, Mail, Share2, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/admin", icon: Home, label: "Dashboard", end: true },
  { to: "/admin/hero", icon: User, label: "Hero Section" },
  { to: "/admin/about", icon: User, label: "About" },
  { to: "/admin/services", icon: Briefcase, label: "Services" },
  { to: "/admin/portfolio", icon: FolderOpen, label: "Portfolio" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/contact", icon: Mail, label: "Contact Messages" },
  { to: "/admin/social", icon: Share2, label: "Social Links" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminSidebar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-heading">Admin Panel</h2>
        <p className="text-xs text-muted-foreground mt-1">MK Kopil Portfolio</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <link.icon className="w-4 h-4" />
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
    </aside>
  );
};

export default AdminSidebar;
