import { pgTable, text, uuid, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const heroContentTable = pgTable("hero_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  name: text("name").notNull().default(""),
  subtitleBn: text("subtitle_bn"),
  subtitleEn: text("subtitle_en"),
  rolesBn: text("roles_bn").array(),
  rolesEn: text("roles_en").array(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const heroIconsTable = pgTable("hero_icons", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  imageUrl: text("image_url").notNull().default(""),
  label: text("label").notNull().default(""),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aboutContentTable = pgTable("about_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  titleBn: text("title_bn"),
  titleEn: text("title_en"),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const skillsTable = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  title: text("title").notNull(),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  iconName: text("icon_name"),
  iconImageUrl: text("icon_image_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const servicesTable = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  title: text("title").notNull(),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  iconName: text("icon_name"),
  level: text("level"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  title: text("title").notNull(),
  descriptionBn: text("description_bn"),
  descriptionEn: text("description_en"),
  imageUrl: text("image_url"),
  link: text("link"),
  category: text("category"),
  level: text("level"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonialsTable = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  nameEn: text("name_en"),
  nameBn: text("name_bn"),
  roleEn: text("role_en"),
  roleBn: text("role_bn"),
  textEn: text("text_en"),
  textBn: text("text_bn"),
  rating: integer("rating"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactMessagesTable = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const socialLinksTable = pgTable("social_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  platform: text("platform").notNull(),
  url: text("url"),
  iconName: text("icon_name"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  siteName: text("site_name"),
  whatsappNumber: text("whatsapp_number"),
  cvUrl: text("cv_url"),
  logoUrl: text("logo_url"),
  sectionOrder: text("section_order").array(),
  showThemeToggle: boolean("show_theme_toggle").default(true),
  showLangToggle: boolean("show_lang_toggle").default(true),
  themePreset: text("theme_preset").default("green"),
  primaryColor: text("primary_color"),
  fontFamily: text("font_family").default("Noto Sans Bengali"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  faviconUrl: text("favicon_url"),
  ogImageUrl: text("og_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const statsTable = pgTable("stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  labelEn: text("label_en"),
  labelBn: text("label_bn"),
  value: real("value"),
  suffix: text("suffix"),
  iconName: text("icon_name"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPostsTable = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  slug: text("slug").notNull().unique(),
  titleEn: text("title_en"),
  titleBn: text("title_bn"),
  excerptEn: text("excerpt_en"),
  excerptBn: text("excerpt_bn"),
  contentEn: text("content_en"),
  contentBn: text("content_bn"),
  coverImageUrl: text("cover_image_url"),
  isPublished: boolean("is_published").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Profile = typeof profilesTable.$inferSelect;
export type HeroContent = typeof heroContentTable.$inferSelect;
export type HeroIcon = typeof heroIconsTable.$inferSelect;
export type AboutContent = typeof aboutContentTable.$inferSelect;
export type Skill = typeof skillsTable.$inferSelect;
export type Service = typeof servicesTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type Testimonial = typeof testimonialsTable.$inferSelect;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type SocialLink = typeof socialLinksTable.$inferSelect;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type Stat = typeof statsTable.$inferSelect;
export type BlogPost = typeof blogPostsTable.$inferSelect;
