"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import AuthWrapper from "../AuthWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/common/alert";
import { CircleCheck } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/common/form";
import { Input } from "@/components/ui/common/input";
import { Button } from "@/components/ui/common/Button";
import {
  resetPasswordSchema,
  TypeResetPasswordSchema,
} from "@/schemas/auth/reset-password.schema";
import { useResetPasswordMutation } from "@/graphql/generated/output";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const t = useTranslations("auth.resetPassword");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [resetPassword, { loading, data }] = useResetPasswordMutation({
    onCompleted: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      toast.error(t("errorMessage"));
      toast.error(error.message);
    },
  });

  const onSubmit = (values: TypeResetPasswordSchema) => {
    resetPassword({
      variables: {
        data: values,
      },
    });
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/login"
      isLeftOff={true}
    >
      {isSuccess ? (
        <Alert>
          <CircleCheck className="size-4" />
          <AlertTitle>{t("successAlertTitle")}</AlertTitle>
          <AlertDescription>{t("successAlertDescription")}</AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      disabled={loading}
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormDescription>{t("emailDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <Button className="mt-2 w-full" disabled={loading}>
              {t("submitButton")}
            </Button>
          </form>
        </Form>
      )}
    </AuthWrapper>
  );
};

export default ResetPasswordForm;
