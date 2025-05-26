"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/common/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import HambargerIcon from "@/components/ui/elements/HambargerIcon";
import Logo from "@/components/ui/elements/Logo";

const MainSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { isMobile, setOpen, open } = useSidebar();

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="py-4 hidden md:block">
            <>
              <div className="flex items-center justify-center">
                <Link
                  href="/"
                  className={cn("", {
                    hidden: !open,
                  })}
                >
                  <Logo />
                </Link>

                <HambargerIcon onClick={() => setOpen(!open)} />
              </div>
            </>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>content</SidebarContent>
      <SidebarFooter>footer</SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
