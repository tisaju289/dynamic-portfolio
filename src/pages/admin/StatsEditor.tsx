import { useState } from "react";
import { useStats } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap } from "lucide-react";

const iconOptions = ["Users", "Briefcase", "Award", "Star", "Target", "TrendingUp", "Heart", "Zap"];
const iconMap: Record<string, any> = { Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap };

const StatsEditor = () => {
  const { data: stats, isLoading } = useStats();
  const queryClient = useQueryClient();

  const addStat = async () => {
    const maxOrder = stats?.length ? Math.max(...stats.map((s: any) => s.sort_order || 0)) + 1 : 0;
    const { error } = await supabase.from("stats").insert({ label_bn: "নতুন", label_en: "New Stat", value: 0, suffix: "+", icon_name: "Star", sort_order: maxOrder });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const updateStat = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from("stats").update({ [field]: value }).eq("id", id);
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
        {stats?.map((stat: any) => {
          const Icon = iconMap[stat.icon_name] || Star;
          return (
            <div key={stat.id} className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold">{stat.label_en} — {stat.value}{stat.suffix}</span>
                </div>
                <button onClick={() => deleteStat(stat.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Label (Bengali)</label>
                  <Input defaultValue={stat.label_bn} onBlur={(e) => updateStat(stat.id, "label_bn", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Label (English)</label>
                  <Input defaultValue={stat.label_en} onBlur={(e) => updateStat(stat.id, "label_en", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Value</label>
                  <Input type="number" defaultValue={stat.value} onBlur={(e) => updateStat(stat.id, "value", parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Suffix</label>
                  <Input defaultValue={stat.suffix} onBlur={(e) => updateStat(stat.id, "suffix", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon</label>
                  <select defaultValue={stat.icon_name} onChange={(e) => updateStat(stat.id, "icon_name", e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    {iconOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Sort Order</label>
                <Input type="number" defaultValue={stat.sort_order || 0} onBlur={(e) => updateStat(stat.id, "sort_order", parseInt(e.target.value) || 0)} className="w-24" />
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
