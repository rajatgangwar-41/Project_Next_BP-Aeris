import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/server/db";

export const POST = async (req: NextRequest) => {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;
      await db.user.upsert({
        where: { id },
        update: {},
        create: {
          id,
          emailAddress: email_addresses?.[0]?.email_address || "",
          firstName: first_name || "",
          lastName: last_name || "",
          imageUrl: image_url || "",
        },
      });
    }

    console.log("User Created");

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }
};
