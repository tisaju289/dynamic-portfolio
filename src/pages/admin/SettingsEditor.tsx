import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

const SettingsEditor = () => {
  const { data, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ site_name: "", whatsapp_number: "", cv_url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) setForm({ site_name: data.site_name || "", whatsapp_number: data.whatsapp_number || "", cv_url: data.cv_url || "" });
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
    const op = data?.id
      ? supabase.from("site_settings").update(form).eq("id", data.id)
      : supabase.from("site_settings").insert(form);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    toast({ title: "Saved!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Site Settings</h1>
      <div className="glass rounded-xl p-6 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Site Name</label>
          <Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
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
        <button onClick={handleSave} className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">Save Changes</button>
      </div>
    </div>
  );
};

export default SettingsEditor;
