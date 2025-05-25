'use client'


import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/common/Button";
import { ChannelAvatar } from "@/components/ui/elements/ChannelAvatar";
import { useCurrent } from "@/hooks/useCurrent";
import React from "react";

const HomePage = () => {

  const { user,isLoadingProfile } = useCurrent()

  return (
    <div className="">
       <Button className="">Click me</Button>
      <ModeToggle/> 
      {isLoadingProfile ? "Loading ..." : JSON.stringify(user)}

      {user && <div>
        <ChannelAvatar channel={{
          username: user?.username,
          avatar: user?.avatar
        }}/>
      </div>}
    </div>
  );
};

export default HomePage;
