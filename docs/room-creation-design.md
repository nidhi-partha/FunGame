# Room Creation (Host) — Design & Decisions

Design notes for issue #3: let a host pick a display name, create a room, be added as
that room's host, and land on `/room/[roomCode]`. Branch: `feature/room-creation`.
Companion to [`database-schema.md`](database-schema.md) and
[`supabase-migration-design.md`](supabase-migration-design.md).

## Goal

A host clicks "Host a Game", types a display name, and ends up in a freshly created room
as its host — with no way to create a room that has no host.

## The blocker: circular required references

`0001_init.sql` sets up a chicken-and-egg pair of rules:

- `rooms.host_id` is `NOT NULL` and references `players.id` — a room must have a host.
- `players.room_id` is `NOT NULL` and references `rooms.id` — a player must have a room.

The `supabase-js` client can't run several writes as one all-or-nothing transaction, and
these foreign keys are checked immediately, so no order of plain inserts works: the room
needs a host that doesn't exist yet, and the host needs a room that doesn't exist yet.

## Decisions

### 1. Keep "every room has a host"; defer the FK check to end-of-transaction

Rejected making `host_id` nullable — we never want a hostless room, and it would change a
shared type (`Room.hostId`). Instead, a new `0002` migration marks the two foreign keys
`DEFERRABLE INITIALLY DEFERRED`, so the database checks them once at the end of a
transaction rather than mid-way. Both rows exist by then, so both rules pass.

### 2. A single database function does both inserts atomically

`0002` adds `create_room_with_host(p_display_name text, p_code text)`. Inside one
transaction it inserts the room (host set to the player id it is about to create) and the
host player (`is_host = true`), then returns the room's `code`. All-or-nothing: a failure
partway saves nothing, so there are no half-made rooms. `host_id` stays `NOT NULL`.

### 3. The form is a Client Component that calls the function and redirects

`src/app/create/page.tsx` renders a controlled display-name form (reusing `ui/button` and
`ui/card`). On submit it validates the name, calls the function via the browser Supabase
client, and on success `router.push("/room/" + code)`.

### 4. Room code is generated client-side and passed in

A short code of `GAME_CONFIG.roomCodeLength` characters is generated in the form and passed
to the function. The `rooms.code` unique constraint is the real guard against collisions;
on a duplicate-code error the form retries with a new code a few times before showing an
error. (A fully server-side generator can come later if collisions ever matter.)

## Type / contract impact

None to `src/types/*`. `host_id` stays required, so `Room`/`RoomRow` are unchanged — nothing
to flag to the co-contributor this time. The `Database` type may gain an optional entry for
the new function so the `rpc(...)` call is typed.

## Scope

In scope:

- `supabase/migrations/0002_create_room_function.sql` (deferrable FKs + function).
- `src/app/create/page.tsx`: display-name form, validation, loading/error states, create +
  redirect.
- Any small helper for code generation (e.g. in `src/lib/`), if warranted.

Out of scope:

- The join flow (`src/app/join/page.tsx`) and the room page itself.
- RLS / anonymous auth (still deferred to a later migration per `supabase-migration-design.md`).
- Avatar selection.

## Applying

Like `0001`, this migration is written here but not pushed automatically. A human with
project access runs `npx supabase db push` to apply it (see
[`supabase/migrations/README.md`](../supabase/migrations/README.md)). Until then the form's
create step has no real database to talk to.
