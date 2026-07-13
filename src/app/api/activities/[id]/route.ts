import { NextResponse } from "next/server";
import { getActivity } from "@/lib/activity";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const activity = await getActivity((await params).id);
    if (!activity) {
      return NextResponse.json({ error: "活动不存在" }, { status: 404 });
    }
    return NextResponse.json(activity);
  } catch {
    return NextResponse.json({ error: "活动不存在" }, { status: 404 });
  }
}
