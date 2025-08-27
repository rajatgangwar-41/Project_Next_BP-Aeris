import React from "react";
import dynamic from "next/dynamic";
// import { Mail } from "./mail";

const Mail = dynamic(() => import("./mail").then((mod) => mod.Mail), {
  //To Be Done, we need to make it false
  ssr: true,
});

const MailPage = () => {
  return (
    <Mail
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
};

export default MailPage;
