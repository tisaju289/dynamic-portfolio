import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";

const DynamicHead = () => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;
    const s = settings as any;

    // Meta title
    if (s.meta_title) {
      document.title = s.meta_title;
    } else if (s.site_name) {
      document.title = s.site_name;
    }

    // Meta description
    const setMeta = (name: string, content: string, attr = "name") => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (s.meta_description) {
      setMeta("description", s.meta_description);
      setMeta("og:description", s.meta_description, "property");
      setMeta("twitter:description", s.meta_description);
    }

    // OG title
    const title = s.meta_title || s.site_name;
    if (title) {
      setMeta("og:title", title, "property");
      setMeta("twitter:title", title);
    }

    // OG image
    if (s.og_image_url) {
      setMeta("og:image", s.og_image_url, "property");
      setMeta("twitter:image", s.og_image_url);
    }

    // Favicon
    if (s.favicon_url) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = s.favicon_url;
      link.type = s.favicon_url.endsWith(".svg") ? "image/svg+xml" : "image/png";
    }
  }, [settings]);

  return null;
};

export default DynamicHead;
