-- DRAFT — local dev seed data. Pairs with supabase/migrations/0001_init_draft.sql.
-- Mirrors src/constants/prompts.ts; keep the two in sync (or delete the constant
-- once prompts are fully DB-backed).

insert into prompts (text, category) values
  ('I once ________ and never told anyone.', 'confession'),
  ('My deepest darkest secret is ______', 'confession'),
  ('The pettiest thing I''ve ever done is ________.', 'petty'),
  ('I''m secretly really good at ________.', 'flex'),
  ('I''m weirdly successful at ______', 'flex'),
  ('If I could get away with it, I would ________.', 'confession'),
  ('The weirdest thing in my search history is ________.', 'chaotic');
