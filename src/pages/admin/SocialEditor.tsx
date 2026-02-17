import { useState } from "react";
import { useSocialLinks } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, icons } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Map common social platform names to Lucide icon names
const platformIconMap: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "Youtube",
  linkedin: "Linkedin",
  twitter: "Twitter",
  github: "Github",
  whatsapp: "MessageCircle",
  telegram: "Send",
  pinterest: "Pin",
  snapchat: "Ghost",
  reddit: "MessageSquare",
  discord: "MessageSquare",
  tiktok: "Music",
  behance: "Palette",
  dribbble: "Dribbble",
  figma: "Figma",
  email: "Mail",
  website: "Globe",
};

const resolveIcon = (platform: string) => {
  const key = platform.toLowerCase().trim();
  return platformIconMap[key] || "Globe";
};

const SocialEditor = () => {
  const { data: links = [], isLoading } = useSocialLinks();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editing, setEditing] = useState<any>(null);

  const handlePlatformChange = (value: string) => {
    setEditing({ ...editing, platform: value, icon_name: resolveIcon(value) });
  };

  const handleSave = async (item: any) => {
    const icon = item.icon_name || resolveIcon(item.platform);
    const payload = { platform: item.platform, url: item.url, icon_name: icon, sort_order: item.sort_order || 0 };
    const op = item.id ? supabase.from("social_links").update(payload).eq("id", item.id) : supabase.from("social_links").insert({ ...payload, user_id: user?.id });
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["social_links"] });
    setEditing(null);
    toast({ title: "Saved!" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("social_links").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["social_links"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  const getPreviewIcon = (iconName: string) => {
    const IconComp = (icons as Record<string, any>)[iconName] || (icons as Record<string, any>)["Globe"];
    return IconComp ? <IconComp className="w-5 h-5" /> : null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Social Links</h1>
        <button onClick={() => setEditing({ platform: "", url: "", icon_name: "Globe", sort_order: links.length })} className="flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 space-y-3 max-w-lg mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Platform Name</label>
            <Input placeholder="e.g. Facebook, Youtube, Linkedin" value={editing.platform} onChange={(e) => handlePlatformChange(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <Input placeholder="https://..." value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Icon Preview:</span>
            <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
              {getPreviewIcon(editing.icon_name)}
            </span>
            <span className="text-xs text-muted-foreground">({editing.icon_name})</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <Input type="number" placeholder="0" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(editing)} className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {links.map((l: any) => (
          <div key={l.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground">
                {getPreviewIcon(l.icon_name)}
              </span>
              <div>
                <p className="font-medium">{l.platform}</p>
                <p className="text-sm text-muted-foreground truncate max-w-xs">{l.url}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(l)} className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted">Edit</button>
              <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialEditor;
