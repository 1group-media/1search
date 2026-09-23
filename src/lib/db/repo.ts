import { query } from './index';

export interface SearchResultItem {
  id: string;
  source: 'commerce' | 'service' | 'venue';
  name: string;
  description: string;
  category: string;
  priceUsd: number;
  priceVes: number;
  bcvRate: number;
  storeSlug: string;
  merchantName: string;
  merchantLocation: string;
  inStock: boolean;
  stockQuantity: number;
  partNumber?: string;
  imageEmoji: string;
  actionUrl: string;
  actionLabel: string;
  deliveryOption: string;
}

export class SearchRepository {
  static async search({
    term = '',
    category = 'all',
  }: {
    term?: string;
    category?: string;
  }): Promise<SearchResultItem[]> {
    const cleanTerm = term.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Fetch Merchants map for BCV rates and names
    const mRes = await query('SELECT slug, name, location, bcv_rate FROM merchants');
    const merchantMap = new Map<string, { name: string; location: string; bcvRate: number }>();
    mRes.rows.forEach(m => {
      merchantMap.set(m.slug, {
        name: m.name,
        location: m.location,
        bcvRate: parseFloat(m.bcv_rate || '66.50')
      });
    });

    // 2. Query Commerce Products
    let prodQuery = `
      SELECT id, store_slug, name, description, price_usd, category, image_emoji, in_stock, stock_quantity, part_number, lead_time_text
      FROM commerce_products
    `;
    const prodParams: any[] = [];

    if (cleanTerm) {
      prodQuery += ` WHERE (
        LOWER(name) LIKE $1 
        OR LOWER(COALESCE(description, '')) LIKE $1 
        OR LOWER(COALESCE(category, '')) LIKE $1 
        OR LOWER(COALESCE(part_number, '')) LIKE $1
      )`;
      prodParams.push(`%${cleanTerm}%`);
    }

    const prodRes = await query(prodQuery, prodParams);

    for (const p of prodRes.rows) {
      const m = merchantMap.get(p.store_slug) || {
        name: p.store_slug === 'motozen' ? 'MotoZen ADV Parts' : 'Licorería San Antonio',
        location: 'Anaco Centro',
        bcvRate: 66.50
      };

      const priceUsd = parseFloat(p.price_usd);
      const priceVes = Number((priceUsd * m.bcvRate).toFixed(2));

      // Filter by category if specified
      if (category !== 'all') {
        const catLower = (p.category || '').toLowerCase();
        const isRepuesto = p.store_slug === 'motozen' || 
                           catLower.includes('freno') || 
                           catLower.includes('transmisión') || 
                           catLower.includes('consumible') || 
                           catLower.includes('llanta') || 
                           catLower.includes('repuesto') ||
                           catLower.includes('aventura');
        const isLicor = p.store_slug === 'san-antonio' || 
                        catLower.includes('cerveza') || 
                        catLower.includes('ron') || 
                        catLower.includes('licor') ||
                        catLower.includes('snack');

        if (category === 'repuestos' && !isRepuesto) continue;
        if (category === 'licores' && !isLicor) continue;
      }

      results.push({
        id: p.id,
        source: 'commerce',
        name: p.name,
        description: p.description || '',
        category: p.category || 'General',
        priceUsd,
        priceVes,
        bcvRate: m.bcvRate,
        storeSlug: p.store_slug,
        merchantName: m.name,
        merchantLocation: m.location,
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        partNumber: p.part_number,
        imageEmoji: p.image_emoji || '📦',
        actionUrl: process.env.NEXT_PUBLIC_COMMERCE_URL 
          ? `${process.env.NEXT_PUBLIC_COMMERCE_URL}/${p.store_slug}` 
          : `https://shop.1group.media/${p.store_slug}`,
        actionLabel: 'Comprar & Delivery',
        deliveryOption: 'Moto en 25 min (1delivery)'
      });
    }

    // 3. Query Workshops & Services
    if (category === 'all' || category === 'talleres') {
      for (const [slug, m] of merchantMap.entries()) {
        if (slug === 'motozen' || cleanTerm.includes('taller') || cleanTerm.includes('mecanic') || cleanTerm.includes('mantenimiento') || cleanTerm.includes('servicio')) {
          if (!cleanTerm || m.name.toLowerCase().includes(cleanTerm) || slug.includes(cleanTerm) || cleanTerm.includes('taller') || cleanTerm.includes('moto')) {
            results.push({
              id: `service_${slug}`,
              source: 'service',
              name: `Taller Especializado · ${m.name}`,
              description: 'Diagnóstico por escáner, mantenimiento preventivo y Pasaporte Digital de Servicio.',
              category: 'Taller Mecánico',
              priceUsd: 25.00,
              priceVes: Number((25.00 * m.bcvRate).toFixed(2)),
              bcvRate: m.bcvRate,
              storeSlug: slug,
              merchantName: m.name,
              merchantLocation: m.location,
              inStock: true,
              stockQuantity: 1,
              imageEmoji: '🛠️',
              actionUrl: process.env.NEXT_PUBLIC_SERVICE_URL 
                ? `${process.env.NEXT_PUBLIC_SERVICE_URL}/${slug}` 
                : `https://service.1group.media/${slug}`,
              actionLabel: 'Ver Taller & Cotizar',
              deliveryOption: 'Recepción en Taller'
            });
          }
        }
      }
    }

    return results;
  }
}
