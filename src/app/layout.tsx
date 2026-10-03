import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scooter Store",
  description: "Gestão para lojas e oficinas de mobilidade elétrica",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
