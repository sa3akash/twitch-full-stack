"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import AuthWrapper from "../AuthWrapper";
import { useTranslations } from "next-intl";
import { useVerifyAccountMutation } from "@/graphql/generated/output";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrent } from "@/hooks/useCurrent";

const VerifyAccountForm = () => {
  const t = useTranslations("auth.verify");
  const {auth} = useAuth()

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { refetch } = useCurrent();

  const [verify] = useVerifyAccountMutation({
    onCompleted() {
      auth()
      refetch()
      toast.success(t("successMessage"));
      router.push("/dashboard/settings");
    },
    onError() {
      toast.error(t("errorMessage"));
      router.push("/account/login");
    },
  });

  useEffect(() => {
    verify({
      variables: {
        data: { token },
      },
    });
  }, [token, verify]);

  return (
    <AuthWrapper heading={t("heading")} isLeftOff={true}>
      <div className="flex justify-center">
        <Loader className="size-8 animate-spin" />
      </div>
    </AuthWrapper>
  );
};

export default VerifyAccountForm;
