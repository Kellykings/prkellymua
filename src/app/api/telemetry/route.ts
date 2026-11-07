import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      logged: true,
      event: body?.event || 'outbound_retailer_click',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ logged: false }, { status: 200 });
  }
}
