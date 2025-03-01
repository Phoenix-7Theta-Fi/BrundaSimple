import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { UTApi } from "uploadthing/server";

// Initialize uploadthing with your API key
const utapi = new UTApi();

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");
    const imageUrl = searchParams.get("url");

    if (!imageId || !imageUrl) {
      return NextResponse.json(
        { error: "Image ID and URL are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("trading-journal");

    // Delete from MongoDB
    const result = await db
      .collection("images")
      .deleteOne({ _id: new ObjectId(imageId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from Uploadthing
    // Extract the file key from the URL
    const fileKey = imageUrl.split("/").pop();
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
    }

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}