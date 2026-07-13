import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: process.env.NEXT_PUBLIC_SITE_NAME || "webtest-tools",
    timestamp: new Date().toISOString(),
  });
}
