
ALTER TABLE public.site_settings 
ADD COLUMN section_order text[] DEFAULT ARRAY['home','about','services','portfolio','testimonials','contact'],
ADD COLUMN show_theme_toggle boolean DEFAULT true,
ADD COLUMN show_lang_toggle boolean DEFAULT true;
