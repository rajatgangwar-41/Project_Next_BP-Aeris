import React from "react";
import dynamic from "next/dynamic";
import { ModeToggle } from "@/components/theme-toggle";
import ComposeButton from "./compose-button";
import { UserButton } from "@clerk/nextjs";
// import { Mail } from "./mail";

const Mail = dynamic(() => import("./mail").then((mod) => mod.Mail), {
  //To Be Done, we need to make it false
  ssr: true,
});

const MailPage = () => {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2">
          <UserButton />
          <ModeToggle />
          <ComposeButton />
        </div>
      </div>
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
};

export default MailPage;
