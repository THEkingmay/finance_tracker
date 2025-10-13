import type { Metadata } from "next";
import GlobalNavbar from "@/components/globalNavbar";

export const metadata: Metadata = {
  title: "History",
  description: "finance , money , memory",
};

export default function HistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <GlobalNavbar/>
        <main>
            {children}
        </main>
    </div>
  );
}
