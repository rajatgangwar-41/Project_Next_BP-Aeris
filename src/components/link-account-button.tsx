"use client";

import React from "react";
import { Button } from "./ui/button";
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko";

const LinkAccountButton = () => {
  const handleClick = async () => {
    const authUrl = await getAurinkoAuthorizationUrl({ serviceType: "Google" });
    console.log("AuthUrl:", authUrl);
  };

  return <Button onClick={handleClick}>Link Account</Button>;
};

export default LinkAccountButton;
