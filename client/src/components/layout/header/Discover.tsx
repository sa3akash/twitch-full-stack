"use client";

import { Icon } from "@/components/images/icon";
import { useTranslations } from "next-intl";
import React from "react";

const Discover = () => {
  const t = useTranslations("layout.header");

  return (
    <div className="flex items-center gap-x-4 cursor-pointer">
      <Icon.discover />
      <span className="text-sm/5 text-muted-foreground">{t("discover")}</span>
      <Icon.arrowDown />
    </div>
  );
};

export default Discover;
