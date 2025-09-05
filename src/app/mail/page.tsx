import React from "react";
import dynamic from "next/dynamic";
import ComposeButton from "./compose-button";
import { ModeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import { cookies } from "next/headers";

const Mail = dynamic(() => import("./mail").then((mod) => mod.Mail), {
  loading: () => <div>Loading...</div>,
  ssr: true,
});

const MailPage = async () => {
  const layout = (await cookies()).get("react-resizable-panels:layout:mail");
  const collapsed = (await cookies()).get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : [20, 32, 48];
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false;

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
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </>
  );
};

export default MailPage;
