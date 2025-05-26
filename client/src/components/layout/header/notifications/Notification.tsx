import { Icon } from "@/components/images/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/common/popover";
import { useFindNotificationsUnreadCountQuery } from "@/graphql/generated/output";
import React from "react";
import NotificationList from "./NotificationList";

const Notification = () => {
  const { data } = useFindNotificationsUnreadCountQuery();

  const count = data?.findNotificationsUnreadCount ?? 0;

  const dispalyCount = count > 10 ? "9+" : count;

  return (
    <Popover>
      <PopoverTrigger className="relative">
        {count > 0 && (
          <span className="absolute -right-3 -top-3 px-[5px] rounded-full bg-primary text-xs font-semibold">
            {dispalyCount}
          </span>
        )}
        <Icon.notificationIconDark />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={26}
        align="end"
        className="max-h-[500px] w-[320px] overflow-y-auto"
      >
        <NotificationList/>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
