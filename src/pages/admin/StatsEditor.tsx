import { useState, useEffect } from "react";
import { useStats } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Save, Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap } from "lucide-react";
import TranslateButton from "@/components/admin/TranslateButton";
import { useAuth } from "@/hooks/useAuth";

const iconOptions = ["Users", "Briefcase", "Award", "Star", "Target", "TrendingUp", "Heart", "Zap"];
const iconMap: Record<string, any> = { Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap };

const StatsEditor = () => {
  const { data: stats, isLoading } = useStats();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [localStats, setLocalStats] = useState<any[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (stats) setLocalStats(stats.map((s: any) => ({ ...s })));
  }, [stats]);

  const updateLocal = (id: string, field: string, value: any) => {
    setLocalStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setDirty((prev) => new Set(prev).add(id));
  };

  const saveStat = async (id: string) => {
    const stat = localStats.find((s) => s.id === id);
    if (!stat) return;
    const { error } = await supabase.from("stats").update({
      label_bn: stat.label_bn, label_en: stat.label_en, value: stat.value,
      suffix: stat.suffix, icon_name: stat.icon_name, sort_order: stat.sort_order,
    }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setDirty((prev) => { const n = new Set(prev); n.delete(id); return n; });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    toast({ title: "সেভ হয়েছে!", description: "Stat সফলভাবে আপডেট হয়েছে।" });
  };

  const addStat = async () => {
    const maxOrder = localStats.length ? Math.max(...localStats.map((s) => s.sort_order || 0)) + 1 : 0;
    const { error } = await supabase.from("stats").insert({ label_bn: "নতুন", label_en: "New Stat", value: 0, suffix: "+", icon_name: "Star", sort_order: maxOrder, user_id: user?.id });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const deleteStat = async (id: string) => {
    const { error } = await supabase.from("stats").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Stats / Counters</h1>
      <div className="space-y-4 max-w-2xl">
        {localStats.map((stat) => {
          const Icon = iconMap[stat.icon_name] || Star;
          const isDirty = dirty.has(stat.id);
          return (
            <div key={stat.id} className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">{stat.label_en} — {stat.value}{stat.suffix}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isDirty && (
                    <Button size="sm" onClick={() => saveStat(stat.id)} className="gap-1">
                      <Save className="w-4 h-4" /> Save
                    </Button>
                  )}
                  <button onClick={() => deleteStat(stat.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium mb-1">Label (Bengali) <TranslateButton sourceText={stat.label_en || ""} targetLang="bn" onTranslated={(t) => updateLocal(stat.id, "label_bn", t)} /></label>
                  <Input value={stat.label_bn || ""} onChange={(e) => updateLocal(stat.id, "label_bn", e.target.value)} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-medium mb-1">Label (English) <TranslateButton sourceText={stat.label_bn || ""} targetLang="en" onTranslated={(t) => updateLocal(stat.id, "label_en", t)} /></label>
                  <Input value={stat.label_en || ""} onChange={(e) => updateLocal(stat.id, "label_en", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Value</label>
                  <Input type="number" value={stat.value ?? 0} onChange={(e) => updateLocal(stat.id, "value", parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Suffix</label>
                  <Input value={stat.suffix || ""} onChange={(e) => updateLocal(stat.id, "suffix", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select value={stat.icon_name || "Star"} onChange={(e) => updateLocal(stat.id, "icon_name", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    {iconOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sort Order</label>
                <Input type="number" value={stat.sort_order || 0} onChange={(e) => updateLocal(stat.id, "sort_order", parseInt(e.target.value) || 0)} className="w-24" />
              </div>
            </div>
          );
        })}
        <button onClick={addStat} className="flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Stat
        </button>
      </div>
    </div>
  );
};

export default StatsEditor;
