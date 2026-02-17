import { useState } from "react";
import { useProjects } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

const PortfolioEditor = () => {
  const { data: projects = [], isLoading } = useProjects();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async (item: any) => {
    const payload = { title: item.title, category: item.category, description_bn: item.description_bn, description_en: item.description_en, image_url: item.image_url, link: item.link, sort_order: item.sort_order || 0, level: item.level || "" };
    const op = item.id
      ? supabase.from("projects").update(payload).eq("id", item.id)
      : supabase.from("projects").insert(payload);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setEditing(null);
    toast({ title: "Saved!" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Portfolio</h1>
        <button onClick={() => setEditing({ title: "", category: "", description_bn: "", description_en: "", image_url: "", link: "", level: "", sort_order: projects.length })} className="flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 space-y-3 max-w-2xl mb-6">
          <Input placeholder="Title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <Input placeholder="Category (e.g. Logo, Branding)" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          <textarea placeholder="Description (Bengali)" value={editing.description_bn} onChange={(e) => setEditing({ ...editing, description_bn: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Description (English)" value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <Input placeholder="Link URL" value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
          <Input placeholder="Level (e.g. Beginner, Intermediate, Expert)" value={editing.level || ""} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
          <Input type="number" placeholder="Sort order" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
          <ImageUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="portfolio" />
          <div className="flex gap-2">
            <button onClick={() => handleSave(editing)} className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p: any) => (
          <div key={p.id} className="glass rounded-xl overflow-hidden">
            {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category}{p.level ? ` • ${p.level}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(p)} className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioEditor;
