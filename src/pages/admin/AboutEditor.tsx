import { useState, useEffect } from "react";
import { useAboutContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const AboutEditor = () => {
  const { data, isLoading } = useAboutContent();
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

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">About Section</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-2xl">
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
    </div>
  );
};

export default AboutEditor;
