import CreateAccountForm from "@/components/features/auth/forms/CreateAccountForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.register");

  return {
    title: t("heading"),
  };
}

const CreatePage = () => {
  return (
    <>
      <CreateAccountForm />
    </>
  );
};

export default CreatePage;
