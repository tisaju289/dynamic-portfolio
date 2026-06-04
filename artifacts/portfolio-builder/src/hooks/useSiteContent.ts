import { useQuery } from "@tanstack/react-query";
import { usePortfolioOwner } from "@/context/PortfolioContext";

const useOwnerId = () => usePortfolioOwner().userId;

const apiFetch = async (path: string) => {
  const res = await fetch(`/api${path}`, { credentials: "include" });
  return res.ok ? res.json() : null;
};

export const useHeroContent = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["hero_content", userId],
    queryFn: async () => userId ? apiFetch(`/hero_content/${userId}`) : null,
    enabled: !!userId,
  });
};

export const useHeroIcons = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["hero_icons", userId],
    queryFn: async () => userId ? (await apiFetch(`/hero_icons/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useAboutContent = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["about_content", userId],
    queryFn: async () => userId ? apiFetch(`/about_content/${userId}`) : null,
    enabled: !!userId,
  });
};

export const useSkills = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["skills", userId],
    queryFn: async () => userId ? (await apiFetch(`/skills/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useServices = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["services", userId],
    queryFn: async () => userId ? (await apiFetch(`/services/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useProjects = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => userId ? (await apiFetch(`/projects/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useTestimonials = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["testimonials", userId],
    queryFn: async () => userId ? (await apiFetch(`/testimonials/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useSocialLinks = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["social_links", userId],
    queryFn: async () => userId ? (await apiFetch(`/social_links/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useSiteSettings = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["site_settings", userId],
    queryFn: async () => userId ? apiFetch(`/site_settings/${userId}`) : null,
    enabled: !!userId,
  });
};

export const useContactMessages = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["contact_messages", userId],
    queryFn: async () => userId ? (await apiFetch(`/contact_messages/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useStats = () => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["stats", userId],
    queryFn: async () => userId ? (await apiFetch(`/stats/${userId}`) ?? []) : [],
    enabled: !!userId,
  });
};

export const useBlogPosts = (includeUnpublished = false) => {
  const userId = useOwnerId();
  return useQuery({
    queryKey: ["blog_posts", userId, includeUnpublished],
    queryFn: async () => {
      if (!userId) return [];
      const qs = includeUnpublished ? "?all=true" : "";
      return (await apiFetch(`/blog_posts/${userId}${qs}`)) ?? [];
    },
    enabled: !!userId,
  });
};

export const useProfileByUsername = (username: string | undefined) =>
  useQuery({
    queryKey: ["profile", username],
    queryFn: async () => username ? apiFetch(`/profiles/username/${encodeURIComponent(username)}`) : null,
    enabled: !!username,
  });

export const useAllProfiles = () =>
  useQuery({
    queryKey: ["all_profiles"],
    queryFn: async () => (await apiFetch("/profiles/all")) ?? [],
  });
