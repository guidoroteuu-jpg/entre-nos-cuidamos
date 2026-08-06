CREATE TABLE public.expressao_checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_nome text NOT NULL,
  mood_score numeric NOT NULL,
  felicidade numeric NOT NULL DEFAULT 0,
  neutro numeric NOT NULL DEFAULT 0,
  tristeza numeric NOT NULL DEFAULT 0,
  raiva numeric NOT NULL DEFAULT 0,
  medo numeric NOT NULL DEFAULT 0,
  surpresa numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.expressao_checkins TO anon;
GRANT SELECT, INSERT ON public.expressao_checkins TO authenticated;
GRANT ALL ON public.expressao_checkins TO service_role;

ALTER TABLE public.expressao_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an anonymous facial check-in"
ON public.expressao_checkins FOR INSERT TO anon, authenticated
WITH CHECK (
  mood_score >= 0 AND mood_score <= 6
  AND length(turma_nome) BETWEEN 1 AND 40
);

CREATE POLICY "Anyone can read anonymous aggregates"
ON public.expressao_checkins FOR SELECT TO anon, authenticated
USING (true);

CREATE INDEX idx_expressao_checkins_turma_created ON public.expressao_checkins (turma_nome, created_at DESC);