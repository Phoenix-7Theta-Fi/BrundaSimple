import { Document, ObjectId, WithId } from "mongodb";
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { toDate } from 'date-fns-tz';

interface ImageDocument extends Document {
  _id: ObjectId;
  imageUrl: string;
  uploadedAt: string;
  tradingDate: string;
  createdAt: Date;
}

import Navigation from "@/components/Navigation";
import ImageCard from "@/components/ImageCard";
import DateRangePicker from "@/components/DateRangePicker";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getImages(startDate?: string, endDate?: string) {
  try {
    const client = await clientPromise;
    const db = client.db("trading-journal");

    let query = {};
    if (startDate || endDate) {
      // Parse dates and set proper day boundaries using date-fns with timezone
      const start = startDate ? 
        startOfDay(toDate(parseISO(startDate), { timeZone: 'Asia/Kolkata' })) : 
        null;
      const end = endDate ? 
        endOfDay(toDate(parseISO(endDate), { timeZone: 'Asia/Kolkata' })) : 
        null;

      query = {
        tradingDate: {
          ...(start && { $gte: start.toISOString() }),
          ...(end && { $lte: end.toISOString() })
        }
      };
      
      // Enhanced debugging
      console.log('Date Range Query:', {
        original: { startDate, endDate },
        parsed: {
          start: start?.toISOString(),
          end: end?.toISOString()
        },
        query
      });
    }

    const images = await db.collection<ImageDocument>("images")
      .find(query)
      .sort({ tradingDate: -1 })
      .toArray();

    // Log results for debugging
    console.log('Found images:', images.length, {
      dates: images.map(img => img.tradingDate)
    });

    return images;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
}

export default async function Gallery() {
  const images = await getImages();
  
  const hasDateFilter = false;

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Trading Charts Gallery
        </h1>
        
        <div className="flex justify-center mb-8">
          <DateRangePicker />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image: WithId<ImageDocument>) => (
            <ImageCard
              key={image._id.toString()}
              id={image._id.toString()}
              imageUrl={image.imageUrl}
              uploadedAt={image.uploadedAt}
              tradingDate={image.tradingDate}
            />
          ))}
        </div>
        
        {images.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            {hasDateFilter
              ? 'No images found for the selected date range.'
              : 'No images uploaded yet. Start by uploading some trading charts!'}
          </p>
        )}
      </main>
    </>
  );
}
