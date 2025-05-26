"use client";

import { Icon } from "@/components/images/icon";
import { useSidebar } from "@/components/ui/common/sidebar";
import HambargerIcon from "@/components/ui/elements/HambargerIcon";
import { useTranslations } from "next-intl";
import React from "react";

const Discover = () => {
  const t = useTranslations("layout.header");

  const { setOpenMobile } = useSidebar();

  return (
    <div>
      <div className="items-center gap-x-4 cursor-pointer hidden md:flex">
        <Icon.discover />
        <span className="text-sm/5 text-muted-foreground">{t("discover")}</span>
        <Icon.arrowDown />
      </div>
      <div className="md:hidden">
        <HambargerIcon onClick={() => setOpenMobile(true)} />
      </div>
    </div>
  );
};

export default Discover;
