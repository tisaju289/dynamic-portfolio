import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, GripVertical, Check, Palette, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { themePresets, fontOptions } from "@/components/DynamicThemeProvider";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_SECTIONS = ["home", "about", "stats", "services", "portfolio", "testimonials", "blog", "contact"];

const sectionLabels: Record<string, string> = {
  home: "Home / Hero",
  about: "About",
  stats: "Stats / Counters",
  services: "Services",
  portfolio: "Portfolio",
  testimonials: "Testimonials",
  blog: "Blog & Articles",
  contact: "Contact",
};

const presetColors: Record<string, string> = {
  green: "#2d8f5e",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  red: "#ef4444",
  orange: "#f97316",
  pink: "#ec4899",
  teal: "#14b8a6",
  indigo: "#6366f1",
};

const SettingsEditor = () => {
  const { data, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState({
    site_name: "", whatsapp_number: "", cv_url: "", logo_url: "",
    section_order: DEFAULT_SECTIONS,
    show_theme_toggle: true,
    show_lang_toggle: true,
    theme_preset: "green",
    primary_color: "",
    font_family: "Noto Sans Bengali",
    meta_title: "",
    meta_description: "",
    favicon_url: "",
    og_image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const dbOrder = (data as any).section_order || DEFAULT_SECTIONS;
      // Merge missing sections from DEFAULT_SECTIONS
      const merged = [...dbOrder, ...DEFAULT_SECTIONS.filter((s) => !dbOrder.includes(s))];
      setForm({
        site_name: data.site_name || "",
        whatsapp_number: data.whatsapp_number || "",
        cv_url: data.cv_url || "",
        logo_url: (data as any).logo_url || "",
        section_order: merged,
        show_theme_toggle: (data as any).show_theme_toggle ?? true,
        show_lang_toggle: (data as any).show_lang_toggle ?? true,
        theme_preset: (data as any).theme_preset || "green",
        primary_color: (data as any).primary_color || "",
        font_family: (data as any).font_family || "Noto Sans Bengali",
        meta_title: (data as any).meta_title || "",
        meta_description: (data as any).meta_description || "",
        favicon_url: (data as any).favicon_url || "",
        og_image_url: (data as any).og_image_url || "",
      });
    }
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
      theme_preset: form.theme_preset,
      primary_color: form.primary_color,
      font_family: form.font_family,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      favicon_url: form.favicon_url,
      og_image_url: form.og_image_url,
    };
    const op = data?.id
      ? supabase.from("site_settings").update(payload as any).eq("id", data.id)
      : supabase.from("site_settings").insert({ ...payload, user_id: user?.id } as any);
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
      <div className="space-y-6 max-w-lg w-full">
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

        {/* Theme Customization */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">Theme Customization</h2>
          </div>

          {/* Pre-made Themes */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme Preset</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Object.entries(presetColors).map(([name, color]) => (
                <button
                  key={name}
                  onClick={() => setForm({ ...form, theme_preset: name, primary_color: "" })}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                    form.theme_preset === name && !form.primary_color
                      ? "border-foreground shadow-md"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                  {form.theme_preset === name && !form.primary_color && (
                    <div className="absolute top-1 right-1">
                      <Check className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  )}
                  <span className="text-xs capitalize font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color */}
          <div>
            <label className="block text-sm font-medium mb-1">Custom Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primary_color || presetColors[form.theme_preset] || "#2d8f5e"}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={form.primary_color}
                onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                placeholder="e.g. #3b82f6 (leave empty for preset)"
                className="flex-1"
              />
              {form.primary_color && (
                <button
                  onClick={() => setForm({ ...form, primary_color: "" })}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Font Family</label>
            <select
              value={form.font_family}
              onChange={(e) => setForm({ ...form, font_family: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {Object.keys(fontOptions).map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: fontOptions[form.font_family] }}>
              Preview: The quick brown fox jumps — দ্রুত বাদামী শিয়াল লাফ দেয়
            </p>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">SEO & Meta Tags</h2>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="Page title for search engines (max 60 chars)" maxLength={60} />
            <p className="text-xs text-muted-foreground mt-1">{form.meta_title.length}/60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} placeholder="Page description for search engines (max 160 chars)" maxLength={160} rows={3} />
            <p className="text-xs text-muted-foreground mt-1">{form.meta_description.length}/160 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Favicon</label>
            <ImageUpload value={form.favicon_url} onChange={(url) => setForm({ ...form, favicon_url: url })} folder="favicon" />
            <p className="text-xs text-muted-foreground mt-1">Recommended: 32×32 or 64×64 PNG/ICO</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OG Image (Social Share)</label>
            <ImageUpload value={form.og_image_url} onChange={(url) => setForm({ ...form, og_image_url: url })} folder="og" />
            <p className="text-xs text-muted-foreground mt-1">Recommended: 1200×630px — Facebook, Twitter, LinkedIn এ শেয়ার করলে এই ছবি দেখাবে</p>
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
