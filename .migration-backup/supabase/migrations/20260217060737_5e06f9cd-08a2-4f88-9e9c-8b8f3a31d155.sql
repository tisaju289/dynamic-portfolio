
-- Stats/Counters table
CREATE TABLE public.stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_bn text DEFAULT '',
  label_en text DEFAULT '',
  value integer DEFAULT 0,
  suffix text DEFAULT '+',
  icon_name text DEFAULT 'Star',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Admin can manage stats" ON public.stats FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn text DEFAULT '',
  title_en text DEFAULT '',
  content_bn text DEFAULT '',
  content_en text DEFAULT '',
  excerpt_bn text DEFAULT '',
  excerpt_en text DEFAULT '',
  cover_image_url text DEFAULT '',
  slug text UNIQUE NOT NULL,
  is_published boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admin can manage blog_posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert some default stats
INSERT INTO public.stats (label_bn, label_en, value, suffix, icon_name, sort_order) VALUES
  ('সন্তুষ্ট ক্লায়েন্ট', 'Happy Clients', 50, '+', 'Users', 1),
  ('সম্পন্ন প্রজেক্ট', 'Projects Done', 100, '+', 'Briefcase', 2),
  ('বছরের অভিজ্ঞতা', 'Years Experience', 3, '+', 'Award', 3),
  ('৫ স্টার রিভিউ', '5 Star Reviews', 30, '+', 'Star', 4);
