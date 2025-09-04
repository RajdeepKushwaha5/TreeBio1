import { NextResponse } from 'next/server';

// TODO: Implement actual functionality for dashboard
export async function GET() {
  return NextResponse.json({
    message: "API endpoint not implemented yet",
    endpoint: "dashboard",
    status: "placeholder"
  }, { status: 501 });
}

export const dynamic = 'force-dynamic';
