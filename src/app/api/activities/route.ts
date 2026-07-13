import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { createToken, hashToken } from "@/lib/security";

const createSchema = z
  .object({
    type: z.enum(["poll", "lottery"]),
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().max(500).default(""),
    options: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
  })
  .superRefine((value, context) => {
    if (value.type === "poll" && value.options.length < 2) {
      context.addIssue({ code: "custom", path: ["options"], message: "投票至少需要两个选项" });
    }
    if (new Set(value.options).size !== value.options.length) {
      context.addIssue({ code: "custom", path: ["options"], message: "投票选项不能重复" });
    }
  });

export async function POST(request: Request) {
  try {
    const input = createSchema.parse(await request.json());
    const sql = getDb();
    const id = randomUUID();
    const adminToken = createToken();

    const queries = [
      sql`
        INSERT INTO activities (id, type, title, description, admin_token_hash)
        VALUES (${id}::uuid, ${input.type}, ${input.title}, ${input.description}, ${hashToken(adminToken)})
      `,
      ...input.options.map((label, index) =>
        sql`
          INSERT INTO poll_options (id, activity_id, label, position)
          VALUES (${randomUUID()}::uuid, ${id}::uuid, ${label}, ${index})
        `,
      ),
    ];

    await sql.transaction(queries);
    return NextResponse.json({ id, adminToken }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "提交内容无效" }, { status: 400 });
    }
    console.error("Create activity failed", error);
    return NextResponse.json({ error: "创建失败，请稍后重试" }, { status: 500 });
  }
}
