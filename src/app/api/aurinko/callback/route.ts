import axios from "axios";
import { waitUntil } from "@vercel/functions";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { getAccountDetails, getAurinkoToken } from "@/lib/aurinko";
import { db } from "@/server/db";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;

  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  if (!code)
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 },
    );

  const token = await getAurinkoToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );

  const accountDetails = await getAccountDetails(token.accessToken);
  await db.account.upsert({
    where: { id: token.accountId.toString() },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      accessToken: token.accessToken,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
  });

  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => {
        console.log("Then response: ", res.data);
      })
      .catch((err) => {
        console.log("Catch error: ", err.response.data);
      }),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
