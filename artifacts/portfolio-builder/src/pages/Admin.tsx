import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { UserCircle } from "lucide-react";

const UsernameSetupBanner = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) return;
    if (!/^[a-z0-9_-]+$/.test(username)) {
      toast({ title: "Invalid username", description: "Only lowercase letters, numbers, hyphens and underscores.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profiles/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), displayName: user?.fullName || username.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save username");
      }
      queryClient.invalidateQueries({ queryKey: ["admin_profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile_by_uid"] });
      toast({ title: "Username set!", description: `Your portfolio will be at /${username.trim()}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border-2 border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-3 mb-3">
        <UserCircle className="w-6 h-6 text-primary flex-shrink-0" />
        <div>
          <p className="font-semibold text-heading">Set your username to publish your portfolio</p>
          <p className="text-xs text-muted-foreground">Your portfolio will be available at <code className="font-mono">yoursite.com/<em>username</em></code></p>
        </div>
      </div>
      <div className="flex gap-2 max-w-sm">
        <Input
          placeholder="e.g. johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={saving || !username.trim()}
          className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? "Saving…" : "Set Username"}
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["admin_profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch("/api/profiles/me", { credentials: "include" });
      return res.ok ? res.json() : null;
    },
    enabled: !!user?.id,
  });

  const needsUsernameSetup = !profileLoading && (!profile || !profile.username);

  return (
    <PortfolioProvider userId={user?.id || null} username={profile?.username || null}>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 overflow-auto w-full min-w-0">
          {needsUsernameSetup && <UsernameSetupBanner />}
          <Outlet />
        </main>
      </div>
    </PortfolioProvider>
  );
};

export default Admin;
