import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOption"; 
import { getServerSession } from "next-auth";
import Sidebar from "@/components/sidebar/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
