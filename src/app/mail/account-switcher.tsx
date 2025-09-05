"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { Plus } from "lucide-react";
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko";
import { toast } from "sonner";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { data: accounts } = api.mail.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  React.useEffect(() => {
    if (accounts && accounts.length > 0) {
      if (accountId) return;
      setAccountId(accounts[0]!.id);
    } else if (accounts && accounts.length === 0) {
      toast("Link an account to continue", {
        action: {
          label: "Add account",
          onClick: async () => {
            try {
              const url = await getAurinkoAuthorizationUrl({
                serviceType: "Google",
              });
              window.location.href = url;
            } catch (error) {
              toast.error((error as Error).message);
            }
          },
        },
      });
    }
  }, [accounts]);

  if (!accounts) return <></>;

  return (
    <div className="flex w-full items-center gap-2">
      <Select defaultValue={accountId} onValueChange={setAccountId}>
        <SelectTrigger
          className={cn(
            "flex w-full flex-1 items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate",
            isCollapsed &&
              "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
          )}
          aria-label="Select account"
        >
          <SelectValue placeholder="Select an account">
            <span className={cn({ hidden: !isCollapsed })}>
              {accounts
                .find((account) => account.id === accountId)
                ?.emailAddress[0]?.toString()
                .toUpperCase()}
            </span>
            <span className={cn("ml-2", isCollapsed && "hidden")}>
              {
                accounts.find((account) => account.id === accountId)
                  ?.emailAddress
              }
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
                {/* {account.icon} */}
                {account.emailAddress}
              </div>
            </SelectItem>
          ))}
          <div
            onClick={async (e) => {
              try {
                const url = await getAurinkoAuthorizationUrl({
                  serviceType: "Google",
                });
                window.location.href = url;
              } catch (error) {
                toast.error((error as Error).message);
              }
            }}
            className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <Plus className="mr-1 size-4" />
            Add account
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
