"use client";

import { Icon } from "@/components/images/icon";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [updated, setUpdated] = useState<string | undefined>("");

  useEffect(() => {
    setUpdated(theme);
  }, [theme]);

  return updated == "dark" ? <Icon.sidebarLogo /> : <Icon.sidebarLogoBlack />;
};

export default Logo;
