"use client";

import React, { useState } from "react";
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
import { useLoginMutation } from "@/graphql/generated/output";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/common/input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const LoginAccountForm = () => {
  const t = useTranslations("auth.login");
  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);

  const router = useRouter();

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const [loginFn, { loading }] = useLoginMutation({
    onCompleted(data) {
      if (data.login.message) {
        setIsShowTwoFactor(true);
      } else {
        // auth()
        toast.success(t("successMessage"));
        router.push("/dashboard/settings");
      }
    },
    onError(error) {
      toast.error(t("errorMessage"));
      toast.error(error.message);
    },
  });

  const onSubmit = (values: TypeLoginSchema) => {
    loginFn({
      variables: { data: values },
    });
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          {isShowTwoFactor ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pinLabel")}</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>{t("pinDescription")}</FormDescription>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("loginLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        disabled={loading}
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
                        disabled={loading}
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>
                      {t("passwordDescription")}
                    </FormDescription>
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
            </>
          )}

          <Button className="mt-2 w-full" disabled={loading}>
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default LoginAccountForm;
