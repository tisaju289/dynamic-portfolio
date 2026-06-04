import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TranslateButtonProps {
  sourceText: string;
  targetLang: "en" | "bn";
  onTranslated: (text: string) => void;
  disabled?: boolean;
}

const TranslateButton = ({ sourceText, targetLang, onTranslated, disabled }: TranslateButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText?.trim()) {
      toast({ title: "No text to translate", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, targetLang }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");
      if (data?.translated) {
        onTranslated(data.translated);
        toast({ title: targetLang === "en" ? "Translated to English!" : "বাংলায় অনুবাদ হয়েছে!" });
      }
    } catch (err: any) {
      toast({ title: "Translation failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={disabled || loading || !sourceText?.trim()}
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
      title={targetLang === "en" ? "Auto-translate to English" : "Auto-translate to Bengali"}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
      {targetLang === "en" ? "→ EN" : "→ BN"}
    </button>
  );
};

export default TranslateButton;
