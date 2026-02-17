import { useState, useEffect } from "react";
import { useAboutContent, useSkills } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Palette, Layers, Share2, Printer, PenTool, Image, Monitor, Smartphone, Globe, Brush, Camera, Type, Code, Zap, Star, Heart, Award, Target, TrendingUp, Trash2, Plus, Upload, Save } from "lucide-react";
import TranslateButton from "@/components/admin/TranslateButton";

const availableIcons: Record<string, any> = {
  Palette, Layers, Share2, Printer, PenTool, Image, Monitor, Smartphone, Globe, Brush, Camera, Type, Code, Zap, Star, Heart, Award, Target, TrendingUp
};

const SkillIconDropZone = ({ skillId, onUploaded }: { skillId: string; onUploaded: (url: string) => void }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `skill-icons/${skillId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
    onUploaded(publicUrl);
    setUploading(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) uploadFile(file); }}
      className={`mt-1 border-2 border-dashed rounded-lg p-3 text-center text-xs transition-colors cursor-pointer ${dragging ? "border-primary bg-primary/10" : "border-border text-muted-foreground hover:border-primary/50"}`}
    >
      <label className="cursor-pointer flex items-center justify-center gap-2">
        <Upload className="w-3 h-3" />
        {uploading ? "Uploading..." : "Drag & drop icon image here, or click to browse"}
        <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
};

const AboutEditor = () => {
  const { data, isLoading } = useAboutContent();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title_bn: "", title_en: "", description_bn: "", description_en: "" });
  const [localSkills, setLocalSkills] = useState<any[]>([]);
  const [dirtySkills, setDirtySkills] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data) setForm({
      title_bn: data.title_bn || "", title_en: data.title_en || "",
      description_bn: data.description_bn || "", description_en: data.description_en || "",
    });
  }, [data]);

  useEffect(() => {
    if (skills) setLocalSkills(skills.map((s: any) => ({ ...s })));
  }, [skills]);

  const handleSave = async () => {
    const op = data?.id
      ? supabase.from("about_content").update(form).eq("id", data.id)
      : supabase.from("about_content").insert(form);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["about_content"] });
    toast({ title: "সেভ হয়েছে!", description: "About section আপডেট হয়েছে।" });
  };

  const updateLocalSkill = (id: string, field: string, value: any) => {
    setLocalSkills((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setDirtySkills((prev) => new Set(prev).add(id));
  };

  const saveSkill = async (id: string) => {
    const skill = localSkills.find((s) => s.id === id);
    if (!skill) return;
    const { error } = await supabase.from("skills").update({
      title: skill.title, icon_name: skill.icon_name, icon_image_url: skill.icon_image_url || "",
      description_bn: skill.description_bn, description_en: skill.description_en, sort_order: skill.sort_order,
    }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setDirtySkills((prev) => { const n = new Set(prev); n.delete(id); return n; });
    queryClient.invalidateQueries({ queryKey: ["skills"] });
    toast({ title: "সেভ হয়েছে!", description: "Skill আপডেট হয়েছে।" });
  };

  const addSkill = async () => {
    const maxOrder = localSkills.length ? Math.max(...localSkills.map((s) => s.sort_order || 0)) + 1 : 0;
    const { error } = await supabase.from("skills").insert({ title: "New Skill", icon_name: "Palette", description_bn: "", description_en: "", sort_order: maxOrder });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["skills"] });
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["skills"] });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">About Section</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-2xl mb-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Title (Bengali) <TranslateButton sourceText={form.title_en} targetLang="bn" onTranslated={(t) => setForm({ ...form, title_bn: t })} /></label>
          <Input value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Title (English) <TranslateButton sourceText={form.title_bn} targetLang="en" onTranslated={(t) => setForm({ ...form, title_en: t })} /></label>
          <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Description (Bengali) <TranslateButton sourceText={form.description_en} targetLang="bn" onTranslated={(t) => setForm({ ...form, description_bn: t })} /></label>
          <textarea value={form.description_bn} onChange={(e) => setForm({ ...form, description_bn: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-1">Description (English) <TranslateButton sourceText={form.description_bn} targetLang="en" onTranslated={(t) => setForm({ ...form, description_en: t })} /></label>
          <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button onClick={handleSave} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">Save Changes</button>
      </div>

      {/* Skills / Cards Section */}
      <h2 className="text-xl font-bold text-heading mb-4">Skills / Cards</h2>
      <div className="space-y-4 max-w-2xl">
        {skillsLoading ? <p>Loading skills...</p> : localSkills.map((skill) => {
          const IconComp = availableIcons[skill.icon_name] || Palette;
          const hasCustomImage = !!skill.icon_image_url;
          const isDirty = dirtySkills.has(skill.id);
          return (
            <div key={skill.id} className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center overflow-hidden">
                    {hasCustomImage ? (
                      <img src={skill.icon_image_url} alt={skill.title} className="w-full h-full object-cover" />
                    ) : (
                      <IconComp className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <span className="font-semibold">{skill.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isDirty && (
                    <Button size="sm" onClick={() => saveSkill(skill.id)} className="gap-1">
                      <Save className="w-4 h-4" /> Save
                    </Button>
                  )}
                  <button onClick={() => deleteSkill(skill.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <Input value={skill.title || ""} onChange={(e) => updateLocalSkill(skill.id, "title", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Lucide Icon (fallback)</label>
                  <select
                    value={skill.icon_name || "Palette"}
                    onChange={(e) => updateLocalSkill(skill.id, "icon_name", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.keys(availableIcons).map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Custom Icon Image (drag & drop or paste URL)</label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste image URL here..."
                      value={skill.icon_image_url || ""}
                      onChange={(e) => updateLocalSkill(skill.id, "icon_image_url", e.target.value)}
                    />
                  </div>
                  {hasCustomImage && (
                    <button
                      onClick={() => updateLocalSkill(skill.id, "icon_image_url", "")}
                      className="text-xs text-destructive hover:underline mt-2"
                    >Remove</button>
                  )}
                </div>
                <SkillIconDropZone
                  skillId={skill.id}
                  onUploaded={(url) => updateLocalSkill(skill.id, "icon_image_url", url)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Description (Bengali)</label>
                <Input value={skill.description_bn || ""} onChange={(e) => updateLocalSkill(skill.id, "description_bn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description (English)</label>
                <Input value={skill.description_en || ""} onChange={(e) => updateLocalSkill(skill.id, "description_en", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sort Order</label>
                <Input type="number" value={skill.sort_order || 0} onChange={(e) => updateLocalSkill(skill.id, "sort_order", parseInt(e.target.value) || 0)} className="w-24" />
              </div>
            </div>
          );
        })}
        <button onClick={addSkill} className="flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>
    </div>
  );
};

export default AboutEditor;
