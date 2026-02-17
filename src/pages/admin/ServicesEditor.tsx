import { useState } from "react";
import { useServices } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import TranslateButton from "@/components/admin/TranslateButton";

const ServicesEditor = () => {
  const { data: services = [], isLoading } = useServices();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async (item: any) => {
    const payload = { title: item.title, description_bn: item.description_bn, description_en: item.description_en, icon_name: item.icon_name, sort_order: item.sort_order || 0, level: item.level || "" };
    const op = item.id
      ? supabase.from("services").update(payload).eq("id", item.id)
      : supabase.from("services").insert(payload);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["services"] });
    setEditing(null);
    toast({ title: "Saved!" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["services"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Services</h1>
        <button onClick={() => setEditing({ title: "", description_bn: "", description_en: "", icon_name: "PenTool", level: "", sort_order: services.length })} className="flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 space-y-4 max-w-2xl mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <Input placeholder="e.g. Beginner, Expert" value={editing.level || ""} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input placeholder="Service title" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon Name (Lucide)</label>
            <Input placeholder="e.g. PenTool, Palette" value={editing.icon_name} onChange={(e) => setEditing({ ...editing, icon_name: e.target.value })} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">Description (Bengali) <TranslateButton sourceText={editing.description_en} targetLang="bn" onTranslated={(t) => setEditing({ ...editing, description_bn: t })} /></label>
            <textarea placeholder="বাংলায় বিবরণ লিখুন" value={editing.description_bn} onChange={(e) => setEditing({ ...editing, description_bn: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1">Description (English) <TranslateButton sourceText={editing.description_bn} targetLang="en" onTranslated={(t) => setEditing({ ...editing, description_en: t })} /></label>
            <textarea placeholder="Write description in English" value={editing.description_en} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
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
        {services.map((s: any) => (
          <div key={s.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.description_en || s.description_bn}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(s)} className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesEditor;
