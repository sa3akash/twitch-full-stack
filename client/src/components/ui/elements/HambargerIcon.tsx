"use client";

import { Icon } from "@/components/images/icon";
import { useTheme } from "next-themes";
import React, { SVGProps, useEffect, useState } from "react";

const HambargerIcon = (props?: SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
    const [updated,setUpdated] = useState<string | undefined>('')
 
  useEffect(()=>{
    setUpdated(theme)
  },[theme])

  return updated === "dark" ? (
    <Icon.hambargerWhiteIcon className="cursor-pointer shrink-0" {...props} />
  ) : (
    <Icon.hambargerDarkIcon className="cursor-pointer shrink-0" />
  );
};

export default HambargerIcon;
