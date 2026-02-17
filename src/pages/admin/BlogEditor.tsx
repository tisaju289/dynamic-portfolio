import { useState } from "react";
import { useBlogPosts } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Eye, EyeOff } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const BlogEditor = () => {
  const { data: posts, isLoading } = useBlogPosts(true);
  const queryClient = useQueryClient();

  const addPost = async () => {
    const slug = `post-${Date.now()}`;
    const { error } = await supabase.from("blog_posts").insert({ title_bn: "নতুন পোস্ট", title_en: "New Post", slug, is_published: false });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  const updatePost = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from("blog_posts").update({ [field]: value }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Blog & Articles</h1>
      <div className="space-y-6 max-w-3xl">
        {posts?.map((post: any) => (
          <div key={post.id} className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${post.is_published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {post.is_published ? "Published" : "Draft"}
                </span>
                <span className="font-semibold">{post.title_en || post.title_bn}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updatePost(post.id, "is_published", !post.is_published)} className="p-2 rounded-lg hover:bg-muted transition-colors" title={post.is_published ? "Unpublish" : "Publish"}>
                  {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => deletePost(post.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Title (Bengali)</label>
                <Input defaultValue={post.title_bn} onBlur={(e) => updatePost(post.id, "title_bn", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Title (English)</label>
                <Input defaultValue={post.title_en} onBlur={(e) => updatePost(post.id, "title_en", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Slug</label>
              <Input defaultValue={post.slug} onBlur={(e) => updatePost(post.id, "slug", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cover Image</label>
              <ImageUpload value={post.cover_image_url || ""} onChange={(url) => updatePost(post.id, "cover_image_url", url)} folder="blog" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Excerpt (Bengali)</label>
                <textarea defaultValue={post.excerpt_bn} onBlur={(e) => updatePost(post.id, "excerpt_bn", e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Excerpt (English)</label>
                <textarea defaultValue={post.excerpt_en} onBlur={(e) => updatePost(post.id, "excerpt_en", e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Content (Bengali)</label>
              <textarea defaultValue={post.content_bn} onBlur={(e) => updatePost(post.id, "content_bn", e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Content (English)</label>
              <textarea defaultValue={post.content_en} onBlur={(e) => updatePost(post.id, "content_en", e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        ))}
        <button onClick={addPost} className="flex items-center gap-2 gradient-bg text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
