"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/common/dropdown-menu";
import { ChannelAvatar } from "@/components/ui/elements/ChannelAvatar";
import { useUserLogoutMutation } from "@/graphql/generated/output";
import { useAuth } from "@/hooks/useAuth";
import { useCurrent } from "@/hooks/useCurrent";
import { LayoutDashboard, Loader, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const HeaderDropdown = () => {
  const t = useTranslations("layout.header.headerMenu.profileMenu");

  const { user, isLoadingProfile } = useCurrent();
const router = useRouter()

	const { exit } = useAuth()

  const [logout] = useUserLogoutMutation({
    onCompleted: ()=>{
        exit()
			toast.success(t('successMessage'))
			router.push('/account/login')
    },
    onError: ()=>{
        toast.error(t('errorMessage'))
    }
  })

  return isLoadingProfile || !user ? (
    <Loader />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <ChannelAvatar channel={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[230px]">
        <DropdownMenuItem className="flex gap-x-3 items-center">
          <ChannelAvatar channel={user} />
          <h2 className="font-medium">{user.username}</h2>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <Link href={`/${user.username}`}>
          <DropdownMenuItem>
            <User className="mr-2 size-2" />
            {t("channel")}
          </DropdownMenuItem>
        </Link>

        <Link href="/dashboard/settings">
          <DropdownMenuItem>
            <LayoutDashboard className="mr-2 size-2" />
            {t("dashboard")}
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem onClick={()=>logout()}>
          <LogOut className="mr-2 size-2" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
