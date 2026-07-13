import { getDb } from "@/lib/db";

export type ActivityType = "poll" | "lottery";
export type ActivityStatus = "open" | "closed" | "drawn";

type ActivityRow = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  created_at: string | Date;
  drawn_at: string | Date | null;
};

type OptionRow = {
  id: string;
  label: string;
  votes: number | string;
};

type ParticipantRow = {
  id: string;
  name: string;
  created_at: string | Date;
  is_winner: boolean;
};

export type PublicActivity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  createdAt: string;
  drawnAt: string | null;
  options: Array<{ id: string; label: string; votes: number }>;
  participants: Array<{ id: string; name: string; createdAt: string; isWinner: boolean }>;
};

export async function getActivity(id: string): Promise<PublicActivity | null> {
  const sql = getDb();
  const activityRows = (await sql`
    SELECT id, type, title, description, status, created_at, drawn_at
    FROM activities
    WHERE id = ${id}::uuid
    LIMIT 1
  `) as ActivityRow[];

  const activity = activityRows[0];
  if (!activity) return null;

  const [optionRows, participantRows] = await Promise.all([
    activity.type === "poll"
      ? (sql`
          SELECT po.id, po.label, count(v.id)::int AS votes
          FROM poll_options po
          LEFT JOIN votes v ON v.option_id = po.id
          WHERE po.activity_id = ${id}::uuid
          GROUP BY po.id, po.label, po.position
          ORDER BY po.position
        ` as unknown as Promise<OptionRow[]>)
      : Promise.resolve([] as OptionRow[]),
    activity.type === "lottery"
      ? (sql`
          SELECT p.id, p.name, p.created_at,
            (p.id = a.winner_participant_id) AS is_winner
          FROM participants p
          JOIN activities a ON a.id = p.activity_id
          WHERE p.activity_id = ${id}::uuid
          ORDER BY p.created_at
        ` as unknown as Promise<ParticipantRow[]>)
      : Promise.resolve([] as ParticipantRow[]),
  ]);

  return {
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    status: activity.status,
    createdAt: new Date(activity.created_at).toISOString(),
    drawnAt: activity.drawn_at ? new Date(activity.drawn_at).toISOString() : null,
    options: optionRows.map((option) => ({
      id: option.id,
      label: option.label,
      votes: Number(option.votes),
    })),
    participants: participantRows.map((participant) => ({
      id: participant.id,
      name: participant.name,
      createdAt: new Date(participant.created_at).toISOString(),
      isWinner: Boolean(participant.is_winner),
    })),
  };
}
