import React from "react";
import { useTheme } from "next-themes";
import { Icon } from "@/components/images/icon";
import { Switch } from "./switch";

const NavToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="flex items-center justify-between">
      <div className="cursor-pointer" onClick={handleChange}>
        {theme === "dark" ? <Icon.darkMoon /> : <Icon.lightSun />}
      </div>

      <Switch
        className="w-16 h-6 !bg-[#F0F3F6]/10 "
        checked={theme === "dark"}
        onCheckedChange={handleChange}
      />

      <Icon.downloadIcon className="cursor-pointer" />
    </div>
  );
};

export default NavToggle;
