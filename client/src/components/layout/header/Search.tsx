"use client";

import { Icon } from "@/components/images/icon";
import { Input } from "@/components/ui/common/input";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

const Search = () => {
  const t = useTranslations("layout.header.search");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchTerm.trim()) {
      router.push(`/streams?searchTerm=${searchTerm.trim()}`);
    } else {
      router.push(`/streams`);
    }
  };

  return (
    <div className="hidden md:flex flex-1 ml-16">
        <form
      onSubmit={onSubmit}
      className="flex gap-x-1 items-center"
    >
      <Icon.searchIcon className="" />
      <Input
        type="text"
        placeholder={t("placeholder")}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="focus-visible:ring-0 bg-transparent placeholder:text-sm/5 placeholder:text-muted-foreground"
      />
    </form>
    </div>
  );
};

export default Search;
