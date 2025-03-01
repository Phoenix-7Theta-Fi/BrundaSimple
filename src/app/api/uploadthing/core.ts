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
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
