import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "../styles/globals.scss";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Next.js Test Task - Frontend Development",
  description:
    "Тестовое задание для демонстрации навыков разработки на Next.js",
  keywords: ["Next.js", "React", "TypeScript", "Frontend", "Development"],
  authors: [{ name: "Frontend Developer" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-right" expand={false} richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
