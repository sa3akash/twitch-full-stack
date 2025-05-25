import { Icon } from "@/components/images/icon";
import { buttonVariants } from "@/components/ui/common/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/common/card";

import NavToggle from "@/components/ui/common/NavToggle";
import { loginCardData } from "@/data/login.data";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, type PropsWithChildren } from "react";

interface AuthWrapperProps {
  isSigup?: boolean;
  heading: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  isLeftOff?: boolean;
}

const AuthWrapper = ({
  children,
  isSigup = false,
  heading,
  backButtonHref,
  backButtonLabel,
  isLeftOff = false,
}: PropsWithChildren<AuthWrapperProps>) => {
  const t = useTranslations("auth");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return;

  return (
    <div
      className={cn(
        "flex h-full items-center justify-center bg-center bg-cover",
        isSigup
          ? "bg-[url(/images/bg/signupbg.png)]"
          : "bg-[url(/images/bg/signinbg.png)]"
      )}
    >
      <div className="flex gap-8 justify-between w-full items-center text-white">
        <div
          className={cn("flex-1 items-center justify-center hidden lg:flex", {
            "lg:hidden": isLeftOff,
          })}
        >
          <div className="space-y-6">
            <Icon.logoLight />
            <h3 className="font-semibold text-[16px]">{t("heading")}</h3>

            <div className="flex flex-col gap-4">
              {loginCardData.map((item, i) => (
                <div
                  className="bg-[#1B1D21]/70 rounded-2xl flex gap-6 items-center"
                  key={i}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={72}
                    height={96}
                    className="rounded-2xl"
                  />
                  <div>
                    <h3 className="font-medium text-sm/5 mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm/4">
                      {item.description}
                    </p>
                    <div className="flex gap-2 items-center mt-2">
                      <div className="size-2 bg-[#FF754C] rounded-full" />
                      <p className="text-muted-foreground text-sm/4">
                        {item.views} views
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="#" className="inline-flex items-center gap-2 group">
              <Icon.pulsCircle />
              <span className="font-bold text-sm/5 group-hover:underline">
                Discover more
              </span>
            </Link>

            <NavToggle />
          </div>
        </div>
        <div
          className={cn("flex-1 flex justify-center lg:justify-start h-max", {
            "lg:justify-center": isLeftOff,
          })}
        >
          <Card className="max-w-[464px] w-full border-0 ">
            <CardHeader>
              <CardTitle
                className={cn(
                  "text-3xl tracking-normal",
                  {
                    "text-center text-2xl": isLeftOff,
                  }
                )}
              >
                {heading}
              </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter className="-mt-2">
              {backButtonLabel && backButtonHref && (
                <Link
                  href={backButtonHref}
                  className={cn(buttonVariants({ variant: "acent" }), "w-full")}
                >
                  {backButtonLabel}
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
