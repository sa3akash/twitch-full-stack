import Header from "@/components/layout/header/Header";
import MainSidebar from "@/components/layout/sidebar/MainSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/common/sidebar";
import { cookies } from "next/headers";
import React, { PropsWithChildren } from "react";

const SiteLayout = async ({ children }: PropsWithChildren) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <MainSidebar />
      <SidebarInset>
        <div className="sticky top-0 inset-y-0 z-50 h-[75px] w-full ">
          <Header />
        </div>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SiteLayout;
