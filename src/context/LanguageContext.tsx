import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "bn" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (bn: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "bn",
  toggleLang: () => {},
  t: (bn) => bn,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("bn");
  const toggleLang = () => setLang((l) => (l === "bn" ? "en" : "bn"));
  const t = (bn: string, en: string) => (lang === "bn" ? bn : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
