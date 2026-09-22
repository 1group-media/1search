import { NextResponse } from 'next/server';
import { SearchRepository } from '@/lib/db/repo';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function GET(req: Request) {
  try {
    // 1. Rate Limiting Check (e.g., 60 requests/min per IP/client)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'client_ip_default';
    const rate = checkRateLimit(ip, 60, 60000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor espere unos segundos.', resetInSec: rate.resetInSec },
        {
          status: 429,
          headers: {
            'Retry-After': String(rate.resetInSec),
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    const results = await SearchRepository.search({ term: q, category });

    return NextResponse.json(
      {
        query: q,
        category,
        count: results.length,
        results,
      },
      {
        headers: {
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': String(rate.remaining),
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
