"use client";

import React from "react";
import AuthWrapper from "../AuthWrapper";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  createAccountSchema,
  type TypeCreateAccountSchema,
} from "@/schemas/auth/create-account.schema";
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

const CreateAccountForm = () => {
  const t = useTranslations("auth.register");

  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: TypeCreateAccountSchema) => {
    console.log(values);
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/login"
      isSigup={true}
    >
      <Form {...form} >
             <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
               <FormField
                 control={form.control}
                 name="username"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>{t("usernameLabel")}</FormLabel>
                     <FormControl>
                       <Input
                         placeholder="johndoe"
                         disabled={false}
                         {...field}
                         className="h-12"
                       />
                     </FormControl>
                     <FormDescription>{t("usernameDescription")}</FormDescription>
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="email"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>{t("emailLabel")}</FormLabel>
                     <FormControl>
                       <Input
                         placeholder="john.doe@example.com"
                         disabled={false}
                         {...field}
                         className="h-12"
                       />
                     </FormControl>
                     <FormDescription>{t("emailDescription")}</FormDescription>
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
               <Button className="mt-2 w-full" disabled={false}>
                 {t("submitButton")}
               </Button>
             </form>
           </Form>
    </AuthWrapper>
  );
};

export default CreateAccountForm;
