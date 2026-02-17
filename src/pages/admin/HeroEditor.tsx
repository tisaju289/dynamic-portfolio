import { useState, useEffect } from "react";
import { useHeroContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const HeroEditor = () => {
  const { data, isLoading } = useHeroContent();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "", subtitle_bn: "", subtitle_en: "",
    roles_bn: "", roles_en: "", image_url: "",
  });

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
          <label className="block text-sm font-medium mb-1">Subtitle (Bengali)</label>
          <Input value={form.subtitle_bn} onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle (English)</label>
          <Input value={form.subtitle_en} onChange={(e) => setForm({ ...form, subtitle_en: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Roles Bengali (comma separated)</label>
          <Input value={form.roles_bn} onChange={(e) => setForm({ ...form, roles_bn: e.target.value })} placeholder="গ্রাফিক্স ডিজাইনার, লোগো ডিজাইনার" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Roles English (comma separated)</label>
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
    </div>
  );
};

export default HeroEditor;
