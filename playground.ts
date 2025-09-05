// // "use server";

// import { create, insert, search } from "@orama/orama";
// import { db } from "./src/server/db.ts";
// import pLimit from "p-limit";
// import { OramaManager } from "./src/lib/orama.ts";
// import { turndown } from "./src/lib/turndown.ts";
// import { getEmbeddings } from "./src/lib/embeddings.ts";
// // import { pluginEmbeddings } from "@orama/plugin-embeddings";
// // import "@tensorflow/tfjs-node";

// // const plugin = await pluginEmbeddings({
// //   embeddings: {
// //     // Property used to store generated embeddings. Must be defined in the schema.
// //     defaultProperty: "embeddings",
// //     onInsert: {
// //       // Generate embeddings at insert-time.
// //       // Turn off if you're inserting documents with embeddings already generated.
// //       generate: true,
// //       // Properties to use for generating embeddings at insert time.
// //       // These properties will be concatenated and used to generate embeddings.
// //       properties: ["description"],
// //       verbose: true,
// //     },
// //   },
// // });

// // Wrap plugin hooks in actual async functions
// // const origBeforeSearch = plugin.beforeSearch;
// // const origBeforeInsert = plugin.beforeInsert;
// // plugin.beforeSearch = async (db, params, language) => {
// //   if (origBeforeSearch) {
// //     await origBeforeSearch(db, params, language);
// //   }
// // };
// // plugin.beforeInsert = async (db, doc, context) => {
// //   if (origBeforeInsert) {
// //     await origBeforeInsert(db, doc, context);
// //   }
// // };

// // const db = create({
// //   schema: {
// //     title: "string",
// //     description: "string",
// //     // Orama generates 512-dimensions vectors.
// //     // When using this plugin, use `vector[512]` as a type.
// //     embeddings: "vector[512]",
// //   },
// // });

// // await insert(db, {
// //   title: "Rajat",
// //   description: "I like automobiles",
// // });

// // const result = await search(db, {
// //   term: "car",
// //   mode: "vector",
// //   similarity: 0.1,
// // });
// // console.log("🚀 ~ result:", result);

// // for (const res of result.hits) console.log(res.document);

// async function syncEmailsToDatabase(emails: any, accountId: string) {
//   console.log(`Syncing Playground ${emails.length} emails to database`);
//   const limit = pLimit(10); // Process up to 10 emails concurrently

//   const oramaClient = new OramaManager(accountId);
//   await oramaClient.initialize();

//   try {
//     async function syncToOrama() {
//       await Promise.all(
//         emails.map((email: any) => {
//           return limit(async () => {
//             const body = turndown.turndown(
//               email.body ?? email.bodySnippet ?? "",
//             );

//             const payload = `From: ${email.from.name} <${email.from.address}>\nTo: ${email.to.map((t: any) => `${t.name} <${t.address}>`).join(", ")}\nSubject: ${email.subject}\nBody: ${body}\n SentAt: ${new Date(email.sentAt).toLocaleString()}`;

//             const bodyEmbedding = await getEmbeddings(payload);

//             await oramaClient.insert({
//               title: email.subject,
//               body: body,
//               rawBody: email.bodySnippet ?? "",
//               from: `${email.from.name} <${email.from.address}>`,
//               to: email.to.map((t: any) => `${t.name} <${t.address}>`),
//               sentAt: new Date(email.sentAt).toLocaleString(),
//               embeddings: bodyEmbedding,
//               threadId: email.threadId,
//             });
//           });
//         }),
//       );
//     }
//     await syncToOrama();
//     await oramaClient.saveIndex();
//   } catch (error) {
//     console.log("error", error);
//   }
// }

// const play = async () => {
//   const emails = await db.email.findMany();

//   await syncEmailsToDatabase(emails, "142147");
// };

// await play();
