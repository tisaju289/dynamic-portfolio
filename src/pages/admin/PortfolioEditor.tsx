import { useState } from "react";
import { useProjects } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const emptyProject = {
  title: "", category: "", description_bn: "", description_en: "",
  image_url: "", link: "", level: "", sort_order: 0,
};

const PortfolioEditor = () => {
  const { data: projects = [], isLoading } = useProjects();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => { setEditing({ ...emptyProject, sort_order: projects.length }); setIsNew(true); };
  const openEdit = (p: any) => { setEditing({ ...p }); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      title: editing.title, category: editing.category,
      description_bn: editing.description_bn, description_en: editing.description_en,
      image_url: editing.image_url, link: editing.link,
      level: editing.level || "", sort_order: editing.sort_order || 0,
    };
    const op = isNew
      ? supabase.from("projects").insert(payload)
      : supabase.from("projects").update(payload).eq("id", editing.id);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setEditing(null);
    toast({ title: "Saved!" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Portfolio</h1>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{p.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{p.level}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-muted transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No projects yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>{isNew ? "Add New Project" : "Edit Project"}</DialogTitle>
                <DialogDescription>Fill in the project details below.</DialogDescription>
              </DialogHeader>
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <Input value={editing?.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <Input placeholder="e.g. Logo, Branding" value={editing?.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Level</label>
                  <Input placeholder="e.g. Beginner, Expert" value={editing?.level || ""} onChange={(e) => setEditing({ ...editing, level: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Description (Bengali)</label>
                  <textarea value={editing?.description_bn || ""} onChange={(e) => setEditing({ ...editing, description_bn: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Description (English)</label>
                  <textarea value={editing?.description_en || ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Link URL</label>
                  <Input placeholder="https://..." value={editing?.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Sort Order</label>
                  <Input type="number" value={editing?.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Image</label>
                <ImageUpload value={editing?.image_url || ""} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="portfolio" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioEditor;
