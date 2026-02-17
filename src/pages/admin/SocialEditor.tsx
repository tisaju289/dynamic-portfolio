import { useState } from "react";
import { useSocialLinks } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

const SocialEditor = () => {
  const { data: links = [], isLoading } = useSocialLinks();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async (item: any) => {
    const payload = { platform: item.platform, url: item.url, icon_name: item.icon_name, sort_order: item.sort_order || 0 };
    const op = item.id ? supabase.from("social_links").update(payload).eq("id", item.id) : supabase.from("social_links").insert(payload);
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
          <Input placeholder="Platform (e.g. Facebook)" value={editing.platform} onChange={(e) => setEditing({ ...editing, platform: e.target.value })} />
          <Input placeholder="URL" value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
          <Input placeholder="Icon name (lucide)" value={editing.icon_name} onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })} />
          <Input type="number" placeholder="Sort order" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          <div className="flex gap-2">
            <button onClick={() => handleSave(editing)} className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {links.map((l: any) => (
          <div key={l.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{l.platform}</p>
              <p className="text-sm text-muted-foreground truncate max-w-xs">{l.url}</p>
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
