import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { QueryProvider } from '@/app/providers/QueryProvider';
import { ErrorBoundary } from '@/shared/ui';
import '@/styles/globals.scss';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Next.js Test Task - Frontend Development',
  description: 'Тестовое задание для демонстрации навыков разработки на Next.js',
  keywords: ['Next.js', 'React', 'TypeScript', 'Frontend', 'Development'],
  authors: [{ name: 'Frontend Developer' }],
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" expand={false} richColors closeButton />
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
