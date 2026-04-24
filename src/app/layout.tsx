import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolAssist - Sistema de Asistencia Escolar",
  description: "Control de asistencia escolar con códigos QR, notificaciones en tiempo real y dashboard en vivo",
  themeColor: "#1a100a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a100a" />
      </head>
      <body className="bg-[hsl(24,25%,10%)] text-[hsl(30,30%,92%)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
