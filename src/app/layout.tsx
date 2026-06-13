import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner"

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "EasyBook - Онлайн-запись в салон красоты",
    description: "Запишитесь на услуги салона красоты онлайн в удобное время",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru" className={cn("font-sans", geist.variable)}>
        <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
            {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
        </body>
        </html>
    );
}