import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Pull Vercel development variables first.");
}

const sql = neon(connectionString);

await sql`
  CREATE TABLE IF NOT EXISTS activities (
    id uuid PRIMARY KEY,
    type text NOT NULL CHECK (type IN ('poll', 'lottery')),
    title varchar(120) NOT NULL,
    description varchar(500) NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'drawn')),
    admin_token_hash char(64) NOT NULL,
    winner_participant_id uuid,
    created_at timestamptz NOT NULL DEFAULT now(),
    drawn_at timestamptz
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS poll_options (
    id uuid PRIMARY KEY,
    activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    label varchar(80) NOT NULL,
    position integer NOT NULL,
    UNIQUE (activity_id, position)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS votes (
    id uuid PRIMARY KEY,
    activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    option_id uuid NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    voter_hash char(64) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (activity_id, voter_hash)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS participants (
    id uuid PRIMARY KEY,
    activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    name varchar(60) NOT NULL,
    visitor_hash char(64) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (activity_id, visitor_hash)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS draw_results (
    id uuid PRIMARY KEY,
    activity_id uuid NOT NULL UNIQUE REFERENCES activities(id) ON DELETE CASCADE,
    participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS votes_option_id_idx ON votes(option_id)`;
await sql`CREATE INDEX IF NOT EXISTS participants_activity_id_idx ON participants(activity_id)`;

console.log("Database schema is ready.");
