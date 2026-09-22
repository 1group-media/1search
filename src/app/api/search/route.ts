import { NextResponse } from 'next/server';
import { SearchRepository } from '@/lib/db/repo';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    const results = await SearchRepository.search({ term: q, category });

    return NextResponse.json({
      query: q,
      category,
      count: results.length,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
