import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolioOwner } from "@/context/PortfolioContext";

const useOwnerId = () => usePortfolioOwner().userId;

export const useHeroContent = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["hero_content", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase.from("hero_content").select("*").eq("user_id", userId).limit(1).single();
      return data;
    },
    enabled: !!userId,
  });
};

export const useHeroIcons = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["hero_icons", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("hero_icons").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useAboutContent = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["about_content", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase.from("about_content").select("*").eq("user_id", userId).limit(1).single();
      return data;
    },
    enabled: !!userId,
  });
};

export const useSkills = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["skills", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("skills").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useServices = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["services", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("services").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useProjects = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("projects").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useTestimonials = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["testimonials", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("testimonials").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useSocialLinks = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["social_links", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("social_links").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useSiteSettings = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["site_settings", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase.from("site_settings").select("*").eq("user_id", userId).limit(1).single();
      return data;
    },
    enabled: !!userId,
  });
};

export const useContactMessages = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["contact_messages", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("contact_messages").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useStats = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["stats", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await supabase.from("stats").select("*").eq("user_id", userId).order("sort_order");
      return data ?? [];
    },
    enabled: !!userId,
  });
};

export const useBlogPosts = (includeUnpublished = false) => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["blog_posts", userId, includeUnpublished],
    queryFn: async () => {
      if (!userId) return [];
      let q = supabase.from("blog_posts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (!includeUnpublished) q = q.eq("is_published", true);
      const { data } = await q;
      return data ?? [];
    },
    enabled: !!userId,
  });
};

// Hook to resolve username to user_id
export const useProfileByUsername = (username: string | undefined) =>
  useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) return null;
      const { data } = await supabase.from("profiles").select("*").eq("username", username).single();
      return data;
    },
    enabled: !!username,
  });

// Hook to get all profiles (for home page listing)
export const useAllProfiles = () =>
  useQuery({
    queryKey: ["all_profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at");
      return data ?? [];
    },
  });
