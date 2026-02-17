import { useState } from "react";
import { useBlogPosts } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Eye, EyeOff, Pencil } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/SortableItem";

const emptyPost = {
  title_bn: "", title_en: "", slug: "", cover_image_url: "",
  excerpt_bn: "", excerpt_en: "", content_bn: "", content_en: "",
  is_published: false,
};

const BlogEditor = () => {
  const { data: posts = [], isLoading } = useBlogPosts(true);
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const openNew = () => { setEditing({ ...emptyPost }); setIsNew(true); };
  const openEdit = (post: any) => { setEditing({ ...post }); setIsNew(false); };

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      title_bn: editing.title_bn, title_en: editing.title_en,
      slug: editing.slug || `post-${Date.now()}`,
      cover_image_url: editing.cover_image_url,
      excerpt_bn: editing.excerpt_bn, excerpt_en: editing.excerpt_en,
      content_bn: editing.content_bn, content_en: editing.content_en,
      is_published: editing.is_published,
    };
    const op = isNew
      ? supabase.from("blog_posts").insert(payload)
      : supabase.from("blog_posts").update(payload).eq("id", editing.id);
    const { error } = await op;
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    setEditing(null);
    toast({ title: "সেভ হয়েছে!" });
  };

  const togglePublish = async (post: any) => {
    await supabase.from("blog_posts").update({ is_published: !post.is_published }).eq("id", post.id);
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  const deletePost = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    toast({ title: "Deleted!" });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = posts.findIndex((p: any) => p.id === active.id);
    const newIndex = posts.findIndex((p: any) => p.id === over.id);
    const reordered = arrayMove(posts, oldIndex, newIndex);

    queryClient.setQueryData(["blog_posts", true], reordered);

    await Promise.all(
      reordered.map((p: any, i: number) =>
        supabase.from("blog_posts").update({ sort_order: i }).eq("id", p.id)
      )
    );
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    toast({ title: "Order updated!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-heading">Blog & Articles</h1>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Post</Button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={posts.map((p: any) => p.id)} strategy={verticalListSortingStrategy}>
                <tbody className="[&_tr:last-child]:border-0">
                  {posts.map((post: any) => (
                    <SortableItem key={post.id} id={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{post.title_en || post.title_bn}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-xs max-w-[150px] truncate">{post.slug}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${post.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {post.is_published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => togglePublish(post)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={post.is_published ? "Unpublish" : "Publish"}>
                            {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-muted transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deletePost(post.id)} className="p-2 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </TableCell>
                    </SortableItem>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan={5} className="text-center text-muted-foreground py-8">No blog posts yet</td></tr>
                  )}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle>{isNew ? "Add New Post" : "Edit Post"}</DialogTitle>
                <DialogDescription>Fill in the details below and save.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Title (Bengali)</label>
                  <Input value={editing?.title_bn || ""} onChange={(e) => setEditing({ ...editing, title_bn: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Title (English)</label>
                  <Input value={editing?.title_en || ""} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Slug</label>
                <Input value={editing?.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Cover Image</label>
                <ImageUpload value={editing?.cover_image_url || ""} onChange={(url) => setEditing({ ...editing, cover_image_url: url })} folder="blog" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Excerpt (Bengali)</label>
                  <textarea value={editing?.excerpt_bn || ""} onChange={(e) => setEditing({ ...editing, excerpt_bn: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Excerpt (English)</label>
                  <textarea value={editing?.excerpt_en || ""} onChange={(e) => setEditing({ ...editing, excerpt_en: e.target.value })} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Content (Bengali)</label>
                <RichTextEditor value={editing?.content_bn || ""} onChange={(html) => setEditing({ ...editing, content_bn: html })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Content (English)</label>
                <RichTextEditor value={editing?.content_en || ""} onChange={(html) => setEditing({ ...editing, content_en: html })} />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Published</label>
                <input type="checkbox" checked={editing?.is_published || false} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} className="rounded" />
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

export default BlogEditor;
