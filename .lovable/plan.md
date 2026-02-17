

# Admin Panel -- Portfolio Website Dynamic Content Management

## Overview
তোমার portfolio website এর সব content কে dynamic করা হবে। একটি admin panel তৈরি হবে যেখান থেকে তুমি সব section এর content (text, image, link) পরিবর্তন করতে পারবে। Public website Supabase database থেকে data fetch করে দেখাবে।

## What You'll Get

- `/admin/login` -- Admin login page (email/password)
- `/admin` -- Dashboard with sidebar navigation
- Each section editable from admin: Hero, About, Services, Portfolio, Testimonials, Contact, Footer, Site Settings
- Portfolio image upload via Supabase Storage
- CV file upload
- Contact form submissions saved to database
- All existing design and animations preserved

## How It Works

1. Public website loads content from Supabase tables
2. If no data in DB yet, fallback to current hardcoded content
3. Admin logs in, edits content through forms, saves to DB
4. Changes reflect immediately on the public site

---

## Technical Details

### Database Tables (8 tables)

| Table | Key Columns |
|-------|-------------|
| `site_settings` | whatsapp_number, site_name, cv_url |
| `hero_content` | name, subtitle_bn, subtitle_en, roles_bn, roles_en, image_url |
| `about_content` | title_bn, title_en, description_bn, description_en |
| `skills` | title, description_bn, description_en, icon_name, sort_order |
| `services` | title, description_bn, description_en, icon_name, sort_order |
| `projects` | title, category, description_bn, description_en, image_url, sort_order |
| `testimonials` | name_bn, name_en, role_bn, role_en, text_bn, text_en, rating |
| `social_links` | platform, url, icon_name, sort_order |
| `contact_messages` | name, email, message, created_at |

All content tables store both Bengali and English versions for the bilingual system.

### Security (RLS)

- All tables: `SELECT` open to everyone (public website reads)
- `INSERT/UPDATE/DELETE`: Only authenticated admin (using `is_admin()` helper function)
- Storage bucket `portfolio-assets`: Public read, admin-only upload/delete
- Contact messages: Public insert (form submission), admin-only read

### Admin Authentication

- Supabase Auth with email/password
- Admin user created manually in Supabase dashboard
- `user_roles` table with `is_admin()` security definer function
- Protected `/admin/*` routes

### New Files

**Pages:**
- `src/pages/AdminLogin.tsx` -- Login form
- `src/pages/Admin.tsx` -- Admin layout with sidebar
- `src/pages/admin/HeroEditor.tsx` -- Edit hero section
- `src/pages/admin/AboutEditor.tsx` -- Edit about section
- `src/pages/admin/ServicesEditor.tsx` -- Edit services (add/edit/delete/reorder)
- `src/pages/admin/PortfolioEditor.tsx` -- Edit projects with image upload
- `src/pages/admin/TestimonialsEditor.tsx` -- Edit testimonials
- `src/pages/admin/ContactEditor.tsx` -- View contact messages + edit contact info
- `src/pages/admin/FooterEditor.tsx` -- Edit social links
- `src/pages/admin/SettingsEditor.tsx` -- WhatsApp number, site name, CV upload

**Hooks:**
- `src/hooks/useSiteContent.ts` -- React Query hooks for fetching each section's data

**Components:**
- `src/components/admin/AdminSidebar.tsx` -- Sidebar navigation
- `src/components/admin/ImageUpload.tsx` -- Reusable image upload component

### Modified Files

All section components (`HeroSection`, `AboutSection`, `ServicesSection`, `PortfolioSection`, `TestimonialsSection`, `ContactSection`, `Footer`, `WhatsAppButton`) will be updated to:
1. Fetch data from Supabase via React Query
2. Fall back to current hardcoded content if DB is empty
3. Use the fetched bilingual content with the existing `t()` function pattern

`src/App.tsx` -- Add admin routes
`src/pages/Index.tsx` -- No major changes needed

### Implementation Order

1. Database migration (all tables + RLS + storage bucket)
2. Auth setup + admin guard component
3. Content hooks (`useSiteContent`)
4. Admin layout + sidebar
5. Each editor page (Hero -> About -> Services -> Portfolio -> Testimonials -> Contact -> Footer -> Settings)
6. Update public section components to read from DB
7. Contact form save to database

