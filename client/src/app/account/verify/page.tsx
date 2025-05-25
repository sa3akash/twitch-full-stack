import VerifyAccountForm from "@/components/features/auth/forms/VerifyAccountForm";
import { redirect } from "next/navigation";
import React from "react";

const VerifyPage = async (props: {
  searchParams: Promise<{ token: string }>;
}) => {
  const searchParams = await props.searchParams;

  if (!searchParams.token) {
    return redirect("/account/create");
  }

  return <VerifyAccountForm />;
};

export default VerifyPage;
