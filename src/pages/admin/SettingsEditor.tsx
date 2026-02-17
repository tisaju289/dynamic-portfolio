import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, GripVertical } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const DEFAULT_SECTIONS = ["home", "about", "services", "portfolio", "testimonials", "contact"];

const sectionLabels: Record<string, string> = {
  home: "Home / Hero",
  about: "About",
  services: "Services",
  portfolio: "Portfolio",
  testimonials: "Testimonials",
  contact: "Contact",
};

const SettingsEditor = () => {
  const { data, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    site_name: "", whatsapp_number: "", cv_url: "", logo_url: "",
    section_order: DEFAULT_SECTIONS,
    show_theme_toggle: true,
    show_lang_toggle: true,
  });
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (data) setForm({
      site_name: data.site_name || "",
      whatsapp_number: data.whatsapp_number || "",
      cv_url: data.cv_url || "",
      logo_url: (data as any).logo_url || "",
      section_order: (data as any).section_order || DEFAULT_SECTIONS,
      show_theme_toggle: (data as any).show_theme_toggle ?? true,
      show_lang_toggle: (data as any).show_lang_toggle ?? true,
    });
  }, [data]);

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `cv/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
    setForm({ ...form, cv_url: publicUrl });
    setUploading(false);
  };

  const handleSave = async () => {
    const payload = {
      site_name: form.site_name,
      whatsapp_number: form.whatsapp_number,
      cv_url: form.cv_url,
      logo_url: form.logo_url,
      section_order: form.section_order,
      show_theme_toggle: form.show_theme_toggle,
      show_lang_toggle: form.show_lang_toggle,
    };
    const op = data?.id
      ? supabase.from("site_settings").update(payload as any).eq("id", data.id)
      : supabase.from("site_settings").insert(payload as any);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    toast({ title: "Saved!" });
  };

  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= form.section_order.length) return;
    const arr = [...form.section_order];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setForm({ ...form, section_order: arr });
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== idx) {
      moveSection(dragIdx, idx);
      setDragIdx(idx);
    }
  };
  const handleDragEnd = () => setDragIdx(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Site Settings</h1>
      <div className="space-y-6 max-w-lg">
        {/* General Settings */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-heading">General</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <ImageUpload value={form.logo_url} onChange={(url) => setForm({ ...form, logo_url: url })} folder="logo" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp Number (with country code)</label>
            <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="8801634124689" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CV File</label>
            {form.cv_url && <p className="text-xs text-muted-foreground mb-2 truncate">{form.cv_url}</p>}
            <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors w-fit text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload CV"}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Button Visibility */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-heading">Button Visibility</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme Toggle (Dark/Light)</span>
            <Switch checked={form.show_theme_toggle} onCheckedChange={(v) => setForm({ ...form, show_theme_toggle: v })} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Language Toggle (বাং/EN)</span>
            <Switch checked={form.show_lang_toggle} onCheckedChange={(v) => setForm({ ...form, show_lang_toggle: v })} />
          </div>
        </div>

        {/* Section Order */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-heading">Section Order</h2>
          <p className="text-xs text-muted-foreground">Drag to reorder sections on your site</p>
          <div className="space-y-2">
            {form.section_order.map((section, idx) => (
              <div
                key={section}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                  dragIdx === idx ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{sectionLabels[section] || section}</span>
                <span className="text-xs text-muted-foreground">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsEditor;
