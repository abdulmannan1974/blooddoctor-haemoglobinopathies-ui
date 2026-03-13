import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Blood🩸Doctor | Dr Abdul Mannan FRCPath FCPS",
  description: "Blood🩸Doctor educator dashboard by Dr Abdul Mannan FRCPath FCPS for haemoglobin variants, case atlas review, and side-by-side comparison.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-[linear-gradient(180deg,_rgba(227,244,247,0.65)_0%,_rgba(248,250,252,0.95)_26%,_rgba(244,247,249,1)_100%)] text-foreground antialiased">
        <TooltipProvider>
          <DashboardShell>{children}</DashboardShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
