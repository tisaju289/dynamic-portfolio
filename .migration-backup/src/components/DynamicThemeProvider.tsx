import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";

const themePresets: Record<string, { hue: number; sat: number; light: string; dark: string }> = {
  green: { hue: 145, sat: 60, light: "40", dark: "45" },
  blue: { hue: 220, sat: 65, light: "50", dark: "55" },
  purple: { hue: 270, sat: 60, light: "50", dark: "55" },
  red: { hue: 0, sat: 70, light: "50", dark: "55" },
  orange: { hue: 25, sat: 90, light: "50", dark: "55" },
  pink: { hue: 330, sat: 65, light: "50", dark: "55" },
  teal: { hue: 175, sat: 60, light: "40", dark: "45" },
  indigo: { hue: 240, sat: 55, light: "50", dark: "55" },
};

const fontOptions: Record<string, string> = {
  "Noto Sans Bengali": "'Noto Sans Bengali', 'Inter', sans-serif",
  "Inter": "'Inter', sans-serif",
  "Poppins": "'Poppins', sans-serif",
  "Roboto": "'Roboto', sans-serif",
  "Open Sans": "'Open Sans', sans-serif",
  "Lato": "'Lato', sans-serif",
};

// Generate Google Fonts URL
const getFontUrl = (font: string) => {
  const f = font.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${f}:wght@300;400;500;600;700;800;900&display=swap`;
};

const applyTheme = (preset: string, customColor: string, font: string) => {
  const root = document.documentElement;
  
  let hue: number, sat: number, lightL: string, lightD: string;

  if (customColor && customColor.startsWith("#")) {
    // Parse hex to HSL
    const rgb = hexToRgb(customColor);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      hue = Math.round(hsl.h);
      sat = Math.round(hsl.s);
      lightL = String(Math.round(hsl.l));
      lightD = String(Math.min(Math.round(hsl.l) + 5, 60));
    } else {
      const t = themePresets[preset] || themePresets.green;
      hue = t.hue; sat = t.sat; lightL = t.light; lightD = t.dark;
    }
  } else {
    const t = themePresets[preset] || themePresets.green;
    hue = t.hue; sat = t.sat; lightL = t.light; lightD = t.dark;
  }

  // Light mode
  root.style.setProperty("--primary", `${hue} ${sat}% ${lightL}%`);
  root.style.setProperty("--heading", `${hue} ${sat}% ${lightL}%`);
  root.style.setProperty("--accent", `${hue} ${Math.max(sat - 5, 30)}% ${Math.max(parseInt(lightL) - 5, 25)}%`);
  root.style.setProperty("--ring", `${hue} ${sat}% ${lightL}%`);
  root.style.setProperty("--secondary", `${hue} 15% 94%`);
  root.style.setProperty("--secondary-foreground", `${hue} 40% 20%`);
  root.style.setProperty("--muted", `${hue} 10% 94%`);
  root.style.setProperty("--muted-foreground", `${hue} 10% 40%`);
  root.style.setProperty("--border", `${hue} 15% 87%`);
  root.style.setProperty("--input", `${hue} 15% 87%`);
  root.style.setProperty("--gradient-start", `${hue} ${sat}% ${parseInt(lightL) + 2}%`);
  root.style.setProperty("--gradient-mid", `${hue + 10} ${Math.max(sat - 5, 30)}% ${parseInt(lightL) - 2}%`);
  root.style.setProperty("--gradient-end", `${hue + 15} ${Math.max(sat - 10, 25)}% ${parseInt(lightL) - 5}%`);
  root.style.setProperty("--sidebar-primary", `${hue} ${sat}% ${lightL}%`);
  root.style.setProperty("--sidebar-accent", `${hue} 10% 95%`);
  root.style.setProperty("--sidebar-accent-foreground", `${hue} 40% 20%`);
  root.style.setProperty("--sidebar-border", `${hue} 13% 91%`);
  root.style.setProperty("--sidebar-ring", `${hue} ${sat}% ${lightL}%`);

  // Font
  if (font && fontOptions[font]) {
    document.body.style.fontFamily = fontOptions[font];
    // Load font
    const existingLink = document.getElementById("dynamic-font");
    if (existingLink) existingLink.remove();
    const link = document.createElement("link");
    link.id = "dynamic-font";
    link.rel = "stylesheet";
    link.href = getFontUrl(font);
    document.head.appendChild(link);
  }
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export { themePresets, fontOptions };

const DynamicThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (settings) {
      const preset = (settings as any).theme_preset || "green";
      const customColor = (settings as any).primary_color || "";
      const font = (settings as any).font_family || "Noto Sans Bengali";
      applyTheme(preset, customColor, font);
    }
  }, [settings]);

  return <>{children}</>;
};

export default DynamicThemeProvider;
