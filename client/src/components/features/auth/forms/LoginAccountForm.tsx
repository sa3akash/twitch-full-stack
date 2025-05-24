"use client";

import React from "react";
import AuthWrapper from "../AuthWrapper";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
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
import { loginSchema, TypeLoginSchema } from "@/schemas/auth/login.schema";
import Link from "next/link";

const LoginAccountForm = () => {
  const t = useTranslations("auth.login");

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = (values: TypeLoginSchema) => {
    console.log(values);
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("loginLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe"
                    // disabled={isLoadingLogin}
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>{t("loginDescription")}</FormDescription>
              </FormItem>
            )}
          />

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
                    disabled={false}
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormDescription>{t("passwordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-2">
            <Link
              href=""
              className="inline-block text-right hover:underline text-muted-foreground"
            >
              Forgot Password?
            </Link>
          </div>
          <Button className="mt-2 w-full" disabled={false}>
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default LoginAccountForm;
