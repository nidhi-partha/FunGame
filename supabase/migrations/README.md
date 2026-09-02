# Migrations

No migrations have been applied to a real Supabase project yet.

`0001_init_draft.sql` is a **draft proposal** of the initial schema (see
`docs/database-schema.md` for the reasoning behind it) — review it together
before running it against a real project. Once agreed, rename it to drop the
`_draft` suffix and apply it with:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Going forward, one migration file per change, numbered sequentially:
`0002_add_x.sql`, `0003_add_y.sql`, etc. Never edit an already-applied migration —
add a new one.
