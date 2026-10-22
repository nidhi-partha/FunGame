-- Initial schema. Mirrors src/types/database.ts. See docs/database-schema.md for the
-- entity relationship writeup, and docs/supabase-migration-design.md for the decisions
-- behind finalizing it. RLS + policies are deferred to a future 0002 migration, shipped
-- with the client's anonymous-auth wiring (auth.uid() = players.id).

create extension if not exists "pgcrypto";

create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_id uuid not null, -- references players.id; added as a fk after players exists
  created_at timestamptz not null default now(),
  max_players integer,
  is_active boolean not null default true
);

create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms (id) on delete cascade,
  display_name text not null,
  avatar_emoji text,
  is_host boolean not null default false,
  joined_at timestamptz not null default now(),
  score integer not null default 0
);

alter table rooms
  add constraint rooms_host_id_fkey foreign key (host_id) references players (id);

create table prompts (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text
);

create table games (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms (id) on delete cascade,
  phase text not null default 'LOBBY',
  current_round_index integer not null default 0,
  total_rounds integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games (id) on delete cascade,
  prompt_id uuid not null references prompts (id),
  round_index integer not null,
  revealed_response_id uuid, -- fk to responses.id, added after responses exists
  created_at timestamptz not null default now()
);

create table responses (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds (id) on delete cascade,
  player_id uuid references players (id), -- null when is_bluff = true
  text text not null,
  is_bluff boolean not null default false,
  submitted_at timestamptz not null default now()
);

alter table rounds
  add constraint rounds_revealed_response_id_fkey foreign key (revealed_response_id) references responses (id);

create table votes (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds (id) on delete cascade,
  response_id uuid not null references responses (id) on delete cascade,
  voter_id uuid not null references players (id),
  guessed_player_id uuid references players (id), -- nullable; null when the guess was "bluff"
  is_bluff_guess boolean not null default false,
  created_at timestamptz not null default now(),
  unique (response_id, voter_id) -- one guess per player per statement
);

-- TODO (0002): enable RLS + policies once anonymous-auth client wiring exists
-- (see docs/supabase-migration-design.md). Likely shape: players can read
-- everything in their own room, but can only insert/update rows tied to
-- their own player_id/voter_id.
-- alter table rooms enable row level security;
-- alter table players enable row level security;
-- ...
