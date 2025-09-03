// import { OpenAIApi, Configuration } from "openai-edge";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function getEmbeddings(text: string) {
//   try {
//     const response = await openai.createEmbedding({
//       model: "text-embedding-ada-002",
//       input: text.replace(/\n/g, " "),
//     });
//     const result = await response.json();
//     console.log("🚀 ~ getEmbeddings ~ result:", result);
//     console.log("🚀 ~ getEmbeddings ~ result:", result.data);
//     console.log("🚀 ~ getEmbeddings ~ result:", result.data[0]);
//     console.log("🚀 ~ getEmbeddings ~ result:", result.data[0].embeding);
//     // console.log(result)
//     return result.data[0].embedding as number[];
//   } catch (error) {
//     console.log("error calling openai embeddings api", error);
//     throw error;
//   }
// }

import { google } from "@ai-sdk/google";
import { embed } from "ai";

export async function getEmbeddings(text: string) {
  try {
    const { embedding } = await embed({
      model: google.textEmbedding("gemini-embedding-001"),
      value: text.replace(/\n/g, " "),
      providerOptions: {
        google: {
          outputDimensionality: 3072, // optional, number of dimensions for the embedding
          taskType: "SEMANTIC_SIMILARITY", // optional, specifies the task type for generating embeddings
        },
      },
    });
    // console.log("🚀 ~ getEmbeddings ~ result:", embedding);
    return embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
