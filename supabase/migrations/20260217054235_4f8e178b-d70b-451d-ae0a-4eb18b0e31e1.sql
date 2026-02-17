
ALTER TABLE public.site_settings 
ADD COLUMN theme_preset text DEFAULT 'green',
ADD COLUMN primary_color text DEFAULT '',
ADD COLUMN font_family text DEFAULT 'Noto Sans Bengali';
