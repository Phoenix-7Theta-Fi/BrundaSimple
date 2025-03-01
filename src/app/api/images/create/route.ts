import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { parseISO, startOfDay } from "date-fns";
import { toDate } from "date-fns-tz";

export async function POST(request: Request) {
  try {
    const { imageUrl, tradingDate } = await request.json();

    if (!imageUrl || !tradingDate) {
      return NextResponse.json(
        { error: "Image URL and trading date are required" },
        { status: 400 }
      );
    }

    // Store trading date as ISO string with consistent timezone and start of day
    const tradingDateISO = startOfDay(
      toDate(parseISO(tradingDate), { timeZone: 'Asia/Kolkata' })
    ).toISOString();

    // Log for debugging
    console.log('Saving image with date:', {
      originalDate: tradingDate,
      storedDate: tradingDateISO
    });

    const client = await clientPromise;
    const db = client.db("trading-journal");
    
    const result = await db.collection("images").insertOne({
      imageUrl,
      tradingDate: tradingDateISO,
      uploadedAt: new Date().toISOString(),
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      tradingDate: tradingDateISO // Return for verification
    });
  } catch (error) {
    console.error("Error saving image metadata:", error);
    return NextResponse.json(
      { error: "Failed to save image metadata" },
      { status: 500 }
    );
  }
}
