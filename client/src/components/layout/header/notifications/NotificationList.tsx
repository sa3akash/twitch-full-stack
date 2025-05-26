"use client";

import { Separator } from "@/components/ui/common/separator";
import {
  useFindNotificationsByUserQuery,
  useFindNotificationsUnreadCountQuery,
} from "@/graphql/generated/output";
import { getNotificationIcon } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { Fragment } from "react";
import parse from "html-react-parser";

const NotificationList = () => {
  const t = useTranslations(
    "layout.header.headerMenu.profileMenu.notifications"
  );
  const { refetch } = useFindNotificationsUnreadCountQuery();

  const { data, loading } = useFindNotificationsByUserQuery({
    onCompleted: () => {
      refetch();
    },
  });

  const notifications = data?.findNotificationsByUser ?? [];

  return (
    <div>
      <h2 className="text-center text-lg font-medium">{t("heading")}</h2>
      <Separator className="my-3" />
      {loading ? (
        <div className="flex items-center justify-center gap-x-2 text-sm text-foreground">
          <Loader2 className="size-5 animate-spin" />
          {t("loading")}
        </div>
      ) : notifications.length ? (
        notifications.map((item, index) => {
          const Icon = getNotificationIcon(item.type);

          return (
            <Fragment key={index}>
              <div className="flex items-center gap-x-3 text-sm">
                <div className="rounded-full bg-foreground p-2">
                  <Icon className="size-6 text-secondary" />
                </div>
                <div>{parse(item.message)}</div>
              </div>
              {index < notifications.length - 1 && (
                <Separator className="my-3" />
              )}
            </Fragment>
          );
        })
      ) : (
        <div className="text-center text-muted-foreground">{t("empty")}</div>
      )}
    </div>
  );
};

export default NotificationList;
