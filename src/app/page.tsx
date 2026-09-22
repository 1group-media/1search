'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Bike,
  Wrench,
  Package,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { SearchResultItem } from '@/lib/db/repo';

export default function SearchDiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async (term = searchTerm, cat = category) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(searchTerm, category);
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(searchTerm, category);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Hero Banner */}
      <header className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900/60 to-transparent pt-8 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DIRECTORIO HIPERLOCAL ANACO · @motozen_adv</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            1search <span className="text-amber-400">Anaco</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Compara repuestos de moto, licores, talleres mecánicos y pide mandados motorizados en un solo lugar.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-4 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Busca pastillas de freno, ron, filtros, talleres..."
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-amber-500 rounded-2xl py-3.5 pl-12 pr-28 text-sm text-slate-100 placeholder-slate-500 focus:outline-none shadow-2xl transition"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition uppercase tracking-wide"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pt-3 pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'repuestos', label: '🛠️ Repuestos' },
              { id: 'licores', label: '🍾 Licores & Bebidas' },
              { id: 'talleres', label: '🔧 Talleres Mecánicos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  category === tab.id
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-400 font-medium">
            {loading ? 'Buscando en Anaco...' : `${results.length} opciones encontradas en Anaco`}
          </p>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Precios en USD (Liquidables a tasa BCV)
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs">Consultando inventario local en vivo...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
            <p className="text-sm font-semibold mb-1">No encontramos resultados para tu búsqueda.</p>
            <p className="text-xs text-slate-500">¿Necesitas una pieza difícil? Pide un mandado urgente y un motorizado la busca en Anaco.</p>
            <a
              href="http://localhost:3003"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl"
            >
              <Bike className="w-4 h-4" />
              <span>Pedir Mandado Motorizado</span>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl p-4 transition shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-2xl p-2 bg-slate-950 rounded-xl border border-slate-800">
                      {item.imageEmoji}
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-400 block leading-tight">
                        ${item.priceUsd.toFixed(2)} USD
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ~{item.priceVes.toFixed(2)} Bs.
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-1 leading-snug">{item.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.description}</p>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {item.merchantName} ({item.merchantLocation})
                    </span>
                    <span className="text-emerald-400 font-semibold">{item.deliveryOption}</span>
                  </div>

                  <a
                    href={item.actionUrl}
                    className="w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition uppercase tracking-wider"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Super App Persistent Footer Rail */}
      <nav className="fixed bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 py-2.5 px-4 z-40">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          <a href="http://localhost:3000" className="flex flex-col items-center py-1 text-slate-400 hover:text-amber-400 transition">
            <span className="text-base">🍻</span>
            <span className="text-[10px] font-bold mt-0.5">1tab</span>
          </a>
          <a href="http://localhost:3001" className="flex flex-col items-center py-1 text-slate-400 hover:text-amber-400 transition">
            <span className="text-base">📦</span>
            <span className="text-[10px] font-bold mt-0.5">1commerce</span>
          </a>
          <a href="http://localhost:3002" className="flex flex-col items-center py-1 text-slate-400 hover:text-amber-400 transition">
            <span className="text-base">🛠️</span>
            <span className="text-[10px] font-bold mt-0.5">1service</span>
          </a>
          <a href="http://localhost:3003" className="flex flex-col items-center py-1 text-slate-400 hover:text-amber-400 transition">
            <span className="text-base">⚡</span>
            <span className="text-[10px] font-bold mt-0.5">1delivery</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
