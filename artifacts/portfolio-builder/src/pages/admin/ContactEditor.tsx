import { useContactMessages } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail } from "lucide-react";

const ContactEditor = () => {
  const { data: messages = [], isLoading } = useContactMessages();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
    toast({ title: "Deleted!" });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading mb-6">Contact Messages</h1>
      {messages.length === 0 ? (
        <p className="text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m: any) => (
            <div key={m.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactEditor;
