-- Room creation inserts a room and its host player together. Because
-- rooms.host_id and players.room_id reference each other and are both NOT NULL,
-- no single-row insert can satisfy both at once. Making the two foreign keys
-- DEFERRABLE INITIALLY DEFERRED lets the checks run at COMMIT instead of per
-- statement, so one transaction can insert both rows before either is validated.
-- host_id stays NOT NULL: a room can never be committed without a host.

alter table rooms
  alter constraint rooms_host_id_fkey deferrable initially deferred;

alter table players
  alter constraint players_room_id_fkey deferrable initially deferred;

-- Create a room and its host in one atomic transaction, returning the room code.
-- The caller generates p_code; a duplicate trips the rooms.code unique
-- constraint (SQLSTATE 23505) and the caller retries with a new code.
create or replace function create_room_with_host(
  p_display_name text,
  p_code text
)
returns text
language plpgsql
as $$
declare
  v_room_id uuid := gen_random_uuid();
  v_player_id uuid := gen_random_uuid();
begin
  insert into rooms (id, code, host_id)
    values (v_room_id, p_code, v_player_id);

  insert into players (id, room_id, display_name, is_host)
    values (v_player_id, v_room_id, p_display_name, true);

  return p_code;
end;
$$;

-- The browser uses the anon key (and, later, an anonymous-auth session), so both
-- roles must be allowed to call this RPC.
grant execute on function create_room_with_host(text, text) to anon, authenticated;
