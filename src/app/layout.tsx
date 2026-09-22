import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1search · Buscador y Comparador de Precios en Anaco',
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
