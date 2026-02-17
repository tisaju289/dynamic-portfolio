
-- 1. Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  display_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can manage profiles" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Add user_id to all content tables
ALTER TABLE public.hero_content ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.hero_icons ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.about_content ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.skills ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.projects ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.testimonials ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.social_links ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.stats ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.blog_posts ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.site_settings ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.contact_messages ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Drop old RLS policies and create new user_id-based ones

-- hero_content
DROP POLICY IF EXISTS "Admin can manage hero" ON public.hero_content;
DROP POLICY IF EXISTS "Public can read hero" ON public.hero_content;
CREATE POLICY "Owner can manage hero_content" ON public.hero_content FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read hero_content" ON public.hero_content FOR SELECT USING (true);

-- hero_icons
DROP POLICY IF EXISTS "Admin can manage hero_icons" ON public.hero_icons;
DROP POLICY IF EXISTS "Public can read hero_icons" ON public.hero_icons;
CREATE POLICY "Owner can manage hero_icons" ON public.hero_icons FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read hero_icons" ON public.hero_icons FOR SELECT USING (true);

-- about_content
DROP POLICY IF EXISTS "Admin can manage about" ON public.about_content;
DROP POLICY IF EXISTS "Public can read about" ON public.about_content;
CREATE POLICY "Owner can manage about_content" ON public.about_content FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read about_content" ON public.about_content FOR SELECT USING (true);

-- services
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Public can read services" ON public.services;
CREATE POLICY "Owner can manage services" ON public.services FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);

-- skills
DROP POLICY IF EXISTS "Admin can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Public can read skills" ON public.skills;
CREATE POLICY "Owner can manage skills" ON public.skills FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);

-- projects
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
CREATE POLICY "Owner can manage projects" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);

-- testimonials
DROP POLICY IF EXISTS "Admin can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public can read testimonials" ON public.testimonials;
CREATE POLICY "Owner can manage testimonials" ON public.testimonials FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read testimonials" ON public.testimonials FOR SELECT USING (true);

-- social_links
DROP POLICY IF EXISTS "Admin can manage social_links" ON public.social_links;
DROP POLICY IF EXISTS "Public can read social_links" ON public.social_links;
CREATE POLICY "Owner can manage social_links" ON public.social_links FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read social_links" ON public.social_links FOR SELECT USING (true);

-- stats
DROP POLICY IF EXISTS "Admin can manage stats" ON public.stats;
DROP POLICY IF EXISTS "Public can read stats" ON public.stats;
CREATE POLICY "Owner can manage stats" ON public.stats FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read stats" ON public.stats FOR SELECT USING (true);

-- blog_posts
DROP POLICY IF EXISTS "Admin can manage blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Owner can manage blog_posts" ON public.blog_posts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read published blog_posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- site_settings
DROP POLICY IF EXISTS "Admin can manage site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
CREATE POLICY "Owner can manage site_settings" ON public.site_settings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);

-- contact_messages: user_id = target portfolio owner
DROP POLICY IF EXISTS "Admin can delete contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact_messages" ON public.contact_messages;
CREATE POLICY "Owner can read contact_messages" ON public.contact_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner can delete contact_messages" ON public.contact_messages FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (NEW.id, REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', '-'), COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
