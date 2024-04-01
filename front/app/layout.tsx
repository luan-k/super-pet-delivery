import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Pet",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <body className={inter.className}>
        <div className='overflow-x-hidden'>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
