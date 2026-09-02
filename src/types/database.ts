/**
 * Snake_case row shapes mirroring the proposed Supabase/Postgres schema
 * (see docs/database-schema.md). This is a hand-written placeholder so both
 * devs can code against a stable contract before migrations exist.
 *
 * TODO: once supabase/migrations/*.sql is finalized and applied, replace this
 * file with the real generated types:
 *   npx supabase gen types typescript --local > src/types/database.ts
 */

export interface RoomRow {
  id: string;
  code: string;
  host_id: string;
  created_at: string;
  max_players: number | null;
  is_active: boolean;
}

export interface PlayerRow {
  id: string;
  room_id: string;
  display_name: string;
  avatar_emoji: string | null;
  is_host: boolean;
  joined_at: string;
  score: number;
}

export interface PromptRow {
  id: string;
  text: string;
  category: string | null;
}

export interface GameRow {
  id: string;
  room_id: string;
  phase: string;
  current_round_index: number;
  total_rounds: number;
  created_at: string;
  updated_at: string;
}

export interface RoundRow {
  id: string;
  game_id: string;
  prompt_id: string;
  round_index: number;
  revealed_response_id: string | null;
  created_at: string;
}

export interface ResponseRow {
  id: string;
  round_id: string;
  player_id: string | null;
  text: string;
  is_bluff: boolean;
  submitted_at: string;
}

export interface VoteRow {
  id: string;
  round_id: string;
  response_id: string;
  voter_id: string;
  guessed_player_id: string; // 'BLUFF' sentinel or a player uuid
  created_at: string;
}

/**
 * Minimal placeholder matching the shape `@supabase/supabase-js`'s
 * `createClient<Database>()` expects. Swap for the real generated file once
 * migrations land (see TODO above).
 */
export interface Database {
  public: {
    Tables: {
      rooms: { Row: RoomRow; Insert: Partial<RoomRow>; Update: Partial<RoomRow> };
      players: { Row: PlayerRow; Insert: Partial<PlayerRow>; Update: Partial<PlayerRow> };
      prompts: { Row: PromptRow; Insert: Partial<PromptRow>; Update: Partial<PromptRow> };
      games: { Row: GameRow; Insert: Partial<GameRow>; Update: Partial<GameRow> };
      rounds: { Row: RoundRow; Insert: Partial<RoundRow>; Update: Partial<RoundRow> };
      responses: { Row: ResponseRow; Insert: Partial<ResponseRow>; Update: Partial<ResponseRow> };
      votes: { Row: VoteRow; Insert: Partial<VoteRow>; Update: Partial<VoteRow> };
    };
  };
}
