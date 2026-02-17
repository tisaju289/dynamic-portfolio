import { useState, useEffect } from "react";
import { useHeroContent, useHeroIcons } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import TranslateButton from "@/components/admin/TranslateButton";

const HeroEditor = () => {
  const { data, isLoading } = useHeroContent();
  const { data: heroIcons = [] } = useHeroIcons();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "", subtitle_bn: "", subtitle_en: "",
    roles_bn: "", roles_en: "", image_url: "",
  });
  const [editingIcon, setEditingIcon] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        subtitle_bn: data.subtitle_bn || "",
        subtitle_en: data.subtitle_en || "",
        roles_bn: (data.roles_bn || []).join(", "),
        roles_en: (data.roles_en || []).join(", "),
        image_url: data.image_url || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    const payload = {
      name: form.name,
      subtitle_bn: form.subtitle_bn,
      subtitle_en: form.subtitle_en,
      roles_bn: form.roles_bn.split(",").map((s) => s.trim()).filter(Boolean),
      roles_en: form.roles_en.split(",").map((s) => s.trim()).filter(Boolean),
      image_url: form.image_url,
    };

    if (data?.id) {
      const { error } = await supabase.from("hero_content").update(payload).eq("id", data.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("hero_content").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    queryClient.invalidateQueries({ queryKey: ["hero_content"] });
    toast({ title: "Saved!" });
  };

  const handleIconSave = async (item: any) => {
    const payload = { image_url: item.image_url, label: item.label, sort_order: item.sort_order || 0 };
    const op = item.id
      ? supabase.from("hero_icons").update(payload as any).eq("id", item.id)
      : supabase.from("hero_icons").insert(payload as any);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["hero_icons"] });
    setEditingIcon(null);
    toast({ title: "Saved!" });
  };

  const handleIconDelete = async (id: string) => {
    await supabase.from("hero_icons").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["hero_icons"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Hero Section</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Subtitle (Bengali) <TranslateButton sourceText={form.subtitle_en} targetLang="bn" onTranslated={(t) => setForm({ ...form, subtitle_bn: t })} /></label>
          <Input value={form.subtitle_bn} onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Subtitle (English) <TranslateButton sourceText={form.subtitle_bn} targetLang="en" onTranslated={(t) => setForm({ ...form, subtitle_en: t })} /></label>
          <Input value={form.subtitle_en} onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Roles Bengali (comma separated) <TranslateButton sourceText={form.roles_en} targetLang="bn" onTranslated={(t) => setForm({ ...form, roles_bn: t })} /></label>
          <Input value={form.roles_bn} onChange={(e) => setForm({ ...form, roles_bn: e.target.value })} placeholder="গ্রাফিক্স ডিজাইনার, লোগো ডিজাইনার" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Roles English (comma separated) <TranslateButton sourceText={form.roles_bn} targetLang="en" onTranslated={(t) => setForm({ ...form, roles_en: t })} /></label>
          <Input value={form.roles_en} onChange={(e) => setForm({ ...form, roles_en: e.target.value })} placeholder="Graphics Designer, Logo Designer" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Image</label>
          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="hero" />
        </div>
        <button onClick={handleSave} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
          Save Changes
        </button>
      </div>

      {/* Floating Icons */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-heading">Floating Icons</h2>
          <button
            onClick={() => setEditingIcon({ image_url: "", label: "", sort_order: heroIcons.length })}
            className="flex items-center gap-2 gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Icon
          </button>
        </div>

        {editingIcon && (
          <div className="glass rounded-xl p-6 space-y-4 max-w-lg mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Label</label>
              <Input placeholder="e.g. Photoshop, Illustrator, Figma" value={editingIcon.label} onChange={(e) => setEditingIcon({ ...editingIcon, label: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon Image</label>
              <ImageUpload value={editingIcon.image_url} onChange={(url) => setEditingIcon({ ...editingIcon, image_url: url })} folder="hero-icons" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sort Order</label>
              <Input type="number" placeholder="0" value={editingIcon.sort_order} onChange={(e) => setEditingIcon({ ...editingIcon, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleIconSave(editingIcon)} className="gradient-bg text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">Save</button>
              <button onClick={() => setEditingIcon(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
          {heroIcons.map((icon: any) => (
            <div key={icon.id} className="glass rounded-xl p-4 flex items-center gap-3">
              {icon.image_url && (
                <img src={icon.image_url} alt={icon.label} className="w-10 h-10 object-contain rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{icon.label}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingIcon(icon)} className="px-2 py-1 rounded text-xs border border-border hover:bg-muted">Edit</button>
                <button onClick={() => handleIconDelete(icon.id)} className="p-1 rounded text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
