import { createUploadthing, type FileRouter } from "uploadthing/next";
import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { timestamp: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const client: MongoClient = await clientPromise;
        const db = client.db("trading-journal");
        
        await db.collection("images").insertOne({
          imageUrl: file.url,
          uploadedAt: new Date(metadata.timestamp),
          createdAt: new Date()
        });

        return { url: file.url };
      } catch (err) {
        console.error("Error saving to MongoDB:", err);
        throw new Error("Failed to save image data");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
