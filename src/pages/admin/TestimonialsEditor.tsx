import { useState } from "react";
import { useTestimonials } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Star } from "lucide-react";

const TestimonialsEditor = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const handleSave = async (item: any) => {
    const payload = { name_bn: item.name_bn, name_en: item.name_en, role_bn: item.role_bn, role_en: item.role_en, text_bn: item.text_bn, text_en: item.text_en, rating: item.rating || 5, sort_order: item.sort_order || 0 };
    const op = item.id ? supabase.from("testimonials").update(payload).eq("id", item.id) : supabase.from("testimonials").insert(payload);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setEditing(null);
    toast({ title: "Saved!" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Testimonials</h1>
        <button onClick={() => setEditing({ name_bn: "", name_en: "", role_bn: "", role_en: "", text_bn: "", text_en: "", rating: 5, sort_order: testimonials.length })} className="flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {editing && (
        <div className="glass rounded-xl p-6 space-y-4 max-w-2xl mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name (Bengali)</label>
              <Input placeholder="বাংলায় নাম" value={editing.name_bn} onChange={(e) => setEditing({ ...editing, name_bn: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name (English)</label>
              <Input placeholder="Name in English" value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role (Bengali)</label>
              <Input placeholder="বাংলায় পদবী" value={editing.role_bn} onChange={(e) => setEditing({ ...editing, role_bn: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role (English)</label>
              <Input placeholder="Role in English" value={editing.role_en} onChange={(e) => setEditing({ ...editing, role_en: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Text (Bengali)</label>
            <textarea placeholder="বাংলায় মন্তব্য লিখুন" value={editing.text_bn} onChange={(e) => setEditing({ ...editing, text_bn: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Text (English)</label>
            <textarea placeholder="Write testimonial in English" value={editing.text_en} onChange={(e) => setEditing({ ...editing, text_en: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rating:</label>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setEditing({ ...editing, rating: n })}>
                <Star className={`w-5 h-5 ${n <= editing.rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(editing)} className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map((t: any) => (
          <div key={t.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{t.name_en || t.name_bn}</p>
              <p className="text-sm text-muted-foreground">{t.role_en || t.role_bn}</p>
              <div className="flex gap-0.5 mt-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-accent text-accent" />)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(t)} className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-muted">Edit</button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsEditor;
