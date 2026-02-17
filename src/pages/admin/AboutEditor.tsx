import { useState, useEffect } from "react";
import { useAboutContent, useSkills } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Palette, Layers, Share2, Printer, PenTool, Image, Monitor, Smartphone, Globe, Brush, Camera, Type, Figma, Code, Zap, Star, Heart, Award, Target, TrendingUp, Trash2, Plus, GripVertical } from "lucide-react";

const availableIcons: Record<string, any> = {
  Palette, Layers, Share2, Printer, PenTool, Image, Monitor, Smartphone, Globe, Brush, Camera, Type, Code, Zap, Star, Heart, Award, Target, TrendingUp
};

const AboutEditor = () => {
  const { data, isLoading } = useAboutContent();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title_bn: "", title_en: "", description_bn: "", description_en: "" });

  useEffect(() => {
    if (data) setForm({
      title_bn: data.title_bn || "", title_en: data.title_en || "",
      description_bn: data.description_bn || "", description_en: data.description_en || "",
    });
  }, [data]);

  const handleSave = async () => {
    const op = data?.id
      ? supabase.from("about_content").update(form).eq("id", data.id)
      : supabase.from("about_content").insert(form);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["about_content"] });
    toast({ title: "Saved!" });
  };

  const addSkill = async () => {
    const maxOrder = skills?.length ? Math.max(...skills.map((s: any) => s.sort_order || 0)) + 1 : 0;
    const { error } = await supabase.from("skills").insert({ title: "New Skill", icon_name: "Palette", description_bn: "", description_en: "", sort_order: maxOrder });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["skills"] });
    toast({ title: "Skill added!" });
  };

  const updateSkill = async (id: string, field: string, value: string | number) => {
    const { error } = await supabase.from("skills").update({ [field]: value }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["skills"] });
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["skills"] });
    toast({ title: "Skill deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">About Section</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-2xl mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Title (Bengali)</label>
          <Input value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title (English)</label>
          <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (Bengali)</label>
          <textarea value={form.description_bn} onChange={(e) => setForm({ ...form, description_bn: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (English)</label>
          <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <button onClick={handleSave} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">Save Changes</button>
      </div>

      {/* Skills / Cards Section */}
      <h2 className="text-xl font-bold text-heading mb-4">Skills / Cards</h2>
      <div className="space-y-4 max-w-2xl">
        {skillsLoading ? <p>Loading skills...</p> : skills?.map((skill: any) => {
          const IconComp = availableIcons[skill.icon_name] || Palette;
          return (
            <div key={skill.id} className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">{skill.title}</span>
                </div>
                <button onClick={() => deleteSkill(skill.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Title</label>
                  <Input defaultValue={skill.title} onBlur={(e) => updateSkill(skill.id, "title", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select
                    defaultValue={skill.icon_name || "Palette"}
                    onChange={(e) => updateSkill(skill.id, "icon_name", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Object.keys(availableIcons).map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description (Bengali)</label>
                <Input defaultValue={skill.description_bn || ""} onBlur={(e) => updateSkill(skill.id, "description_bn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description (English)</label>
                <Input defaultValue={skill.description_en || ""} onBlur={(e) => updateSkill(skill.id, "description_en", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sort Order</label>
                <Input type="number" defaultValue={skill.sort_order || 0} onBlur={(e) => updateSkill(skill.id, "sort_order", parseInt(e.target.value) || 0)} className="w-24" />
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
