import React, { type ComponentProps } from "react";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useThreads } from "@/hooks/use-threads";
import { useThread } from "@/hooks/use-thread";

export function ThreadList() {
  const { threads } = useThreads();
  const [threadId, setThreadId] = useThread();

  const groupedThreads = threads?.reduce(
    (acc: any, thread: any) => {
      const date = format(thread.lastMessageDate ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  return (
    <div className="max-h-[calc(100vh-140px)] max-w-full overflow-y-scroll">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
          <React.Fragment key={date}>
            <div className="text-muted-foreground mt-4 text-xs font-medium first:mt-0">
              {format(new Date(date), "MMMM d, yyyy")}
            </div>
            {threads?.map((item: any) => (
              <button
                id={`thread-${item.id}`}
                key={item.id}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all",
                )}
                onClick={() => {
                  setThreadId(item.id);
                }}
              >
                {threadId === item.id && (
                  <motion.div
                    className="absolute inset-0 z-[-1] rounded-lg bg-black/10 dark:bg-white/20"
                    layoutId="thread-list-item"
                    transition={{
                      duration: 0.1,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {item.emails.at(-1)?.from?.name}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        threadId === item.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatDistanceToNow(
                        item.emails.at(-1)?.sentAt ?? new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.subject}</div>
                </div>
                <div
                  className="text-muted-foreground line-clamp-2 text-xs"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      item.emails.at(-1)?.bodySnippet ?? "",
                      {
                        USE_PROFILES: { html: true },
                      },
                    ),
                  }}
                ></div>
                {item.emails[0]?.sysLabels.length ? (
                  <div className="flex items-center gap-2">
                    {item.emails.at(0)?.sysLabels.map((label: any) => (
                      <Badge
                        key={label}
                        variant={getBadgeVariantFromLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
