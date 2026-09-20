import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { MaterialsProvider } from "@/components/materials/MaterialsProvider";
import SiteHeader from "@/components/SiteHeader";
import WaveFooter from "@/components/WaveFooter";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Project E-READ | Maugat East Elementary School",
    template: "%s | Project E-READ",
  },
  description:
    "Project E-READ — digital reading materials for Maugat East Elementary School, Maugat East, Padre Garcia, Batangas.",
  icons: {
    icon: [{ url: "/school-logo.png", type: "image/png" }],
    apple: [{ url: "/school-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <MaterialsProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <WaveFooter />
        </MaterialsProvider>
      </body>
    </html>
  );
}
