import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { hashVisitor } from "@/lib/security";

const joinSchema = z.object({
  name: z.string().trim().min(1).max(60),
  visitorId: z.string().min(12).max(100),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const input = joinSchema.parse(await request.json());
    const sql = getDb();
    const rows = (await sql`
      INSERT INTO participants (id, activity_id, name, visitor_hash)
      SELECT ${randomUUID()}::uuid, a.id, ${input.name}, ${hashVisitor(id, input.visitorId)}
      FROM activities a
      WHERE a.id = ${id}::uuid
        AND a.type = 'lottery'
        AND a.status = 'open'
      ON CONFLICT (activity_id, visitor_hash) DO NOTHING
      RETURNING id
    `) as unknown as Array<{ id: string }>;

    if (rows.length === 0) {
      return NextResponse.json({ error: "你已经报名，或活动已开奖" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "请输入有效昵称" }, { status: 400 });
    }
    return NextResponse.json({ error: "报名失败，请稍后重试" }, { status: 500 });
  }
}
