import { NextResponse } from 'next/server';
import { getProgrammes } from '@/lib/cms';

export async function GET() {
  const data = await getProgrammes();
  return NextResponse.json(data);
}
