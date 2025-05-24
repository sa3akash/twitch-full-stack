import LoginAccountForm from "@/components/features/auth/forms/LoginAccountForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.login");

  return {
    title: t("heading"),
  };
}

const LoginPage = () => {
  return (
    <>
      <LoginAccountForm />
    </>
  );
};

export default LoginPage;
