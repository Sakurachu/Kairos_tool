import { randomInt, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { tokensMatch } from "@/lib/security";

const drawSchema = z.object({ adminToken: z.string().min(20).max(100) });

type AdminRow = { admin_token_hash: string; status: string };
type ParticipantRow = { id: string };

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = drawSchema.parse(await request.json());
    const sql = getDb();
    const adminRows = (await sql`
      SELECT admin_token_hash, status
      FROM activities
      WHERE id = ${id}::uuid AND type = 'lottery'
      LIMIT 1
    `) as AdminRow[];
    const activity = adminRows[0];

    if (!activity || !tokensMatch(input.adminToken, activity.admin_token_hash)) {
      return NextResponse.json({ error: "没有开奖权限" }, { status: 403 });
    }
    if (activity.status === "drawn") {
      return NextResponse.json({ error: "活动已经开奖" }, { status: 409 });
    }

    const participants = (await sql`
      SELECT id FROM participants WHERE activity_id = ${id}::uuid ORDER BY id
    `) as ParticipantRow[];
    if (participants.length === 0) {
      return NextResponse.json({ error: "还没有参与者" }, { status: 409 });
    }

    const winner = participants[randomInt(participants.length)];
    const result = (await sql`
      WITH updated AS (
        UPDATE activities
        SET status = 'drawn', winner_participant_id = ${winner.id}::uuid, drawn_at = now()
        WHERE id = ${id}::uuid AND status = 'open'
        RETURNING id
      )
      INSERT INTO draw_results (id, activity_id, participant_id)
      SELECT ${randomUUID()}::uuid, updated.id, ${winner.id}::uuid FROM updated
      ON CONFLICT (activity_id) DO NOTHING
      RETURNING participant_id
    `) as unknown as Array<{ participant_id: string }>;

    if (result.length === 0) {
      return NextResponse.json({ error: "活动已经开奖" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "管理密钥无效" }, { status: 400 });
    }
    console.error("Draw failed", error);
    return NextResponse.json({ error: "开奖失败，请稍后重试" }, { status: 500 });
  }
}
