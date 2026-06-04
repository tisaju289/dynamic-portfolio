
-- Create profiles for existing users
INSERT INTO public.profiles (user_id, username, display_name) VALUES
  ('d79f99e7-f381-45e6-9896-a5f3f4fbe4eb', 'sajufeni', 'Saju'),
  ('1292f8c9-74da-40db-8824-5c00e1900508', 'juraju', 'Ju Raju')
ON CONFLICT (user_id) DO NOTHING;

-- Assign all existing data (without user_id) to the first user
UPDATE public.hero_content SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.hero_icons SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.about_content SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.services SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.skills SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.projects SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.testimonials SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.social_links SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.stats SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.blog_posts SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.site_settings SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
UPDATE public.contact_messages SET user_id = 'd79f99e7-f381-45e6-9896-a5f3f4fbe4eb' WHERE user_id IS NULL;
