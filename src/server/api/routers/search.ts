import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { authoriseAccountAccess } from "./mail";
import { OramaManager } from "@/lib/orama";
// import { getEmbeddings } from "@/lib/embeddings";

export const searchRouter = createTRPCRouter({
  searchEmails: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        query: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      if (!account) throw new Error("Invalid token");

      const oramaManager = new OramaManager(account.id);
      await oramaManager.initialize();

      const { query } = input;
      const results = await oramaManager.search({ term: query });

      return results;
    }),
});
