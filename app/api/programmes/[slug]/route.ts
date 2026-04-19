import { NextResponse } from 'next/server';
import { getProgrammeBySlug } from '@/lib/cms';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const programme = await getProgrammeBySlug(params.slug);
  if (!programme) {
    return NextResponse.json({ message: 'Programme not found' }, { status: 404 });
  }
  return NextResponse.json(programme);
}
