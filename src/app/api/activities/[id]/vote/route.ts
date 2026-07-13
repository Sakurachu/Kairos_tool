import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { hashVisitor } from "@/lib/security";

const voteSchema = z.object({
  optionId: z.string().uuid(),
  visitorId: z.string().min(12).max(100),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = voteSchema.parse(await request.json());
    const sql = getDb();
    const rows = (await sql`
      INSERT INTO votes (id, activity_id, option_id, voter_hash)
      SELECT ${randomUUID()}::uuid, a.id, po.id, ${hashVisitor(id, input.visitorId)}
      FROM activities a
      JOIN poll_options po ON po.activity_id = a.id
      WHERE a.id = ${id}::uuid
        AND a.type = 'poll'
        AND a.status = 'open'
        AND po.id = ${input.optionId}::uuid
      ON CONFLICT (activity_id, voter_hash) DO NOTHING
      RETURNING id
    `) as unknown as Array<{ id: string }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "你已经投过票，或活动已结束" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请选择有效选项" }, { status: 400 });
    }
    return NextResponse.json({ error: "投票失败，请稍后重试" }, { status: 500 });
  }
}
