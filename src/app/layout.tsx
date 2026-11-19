import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Cursos Bio", description: "Plataforma de formación Bio" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
