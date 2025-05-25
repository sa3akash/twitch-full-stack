'use client';

import React from "react";
import AuthWrapper from "../AuthWrapper";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  newPasswordSchema,
  TypeNewPasswordSchema,
} from "@/schemas/auth/new.password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useNewPasswordMutation } from "@/graphql/generated/output";
import { toast } from "sonner";

const NewPasswordForm = () => {
  const t = useTranslations("auth.newPassword");

  const router = useRouter();
  const params = useParams<{ token: string }>();

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });

  const [newPassword,{loading}] = useNewPasswordMutation({
    onCompleted: () => {
      toast.success(t("successMessage"));
      router.push("/account/login");
    },
    onError: () => {
      toast.error(t("errorMessage"));
    },
  });

  const onSubmit = (values: TypeNewPasswordSchema) => {
    newPassword({
      variables: {
        data: {
          ...values,
          token: params.token,
        },
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    disabled={loading}
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormDescription>{t("passwordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordRepeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordRepeatLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    disabled={loading}
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormDescription>
                  {t("passwordRepeatDescription")}
                </FormDescription>
              </FormItem>
            )}
          />
          <Button className="mt-2 w-full" disabled={loading}>
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default NewPasswordForm;
