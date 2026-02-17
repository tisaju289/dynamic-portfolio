
CREATE TABLE public.hero_icons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage hero_icons" ON public.hero_icons FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can read hero_icons" ON public.hero_icons FOR SELECT
  USING (true);
