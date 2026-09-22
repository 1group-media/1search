import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://search.1group.media'),
  title: '1search · Buscador y Comparador Hiperlocal (search.1group.media)',
  description: 'Compara precios y disponibilidad de repuestos, licores, talleres y mandados en Anaco, Venezuela',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
