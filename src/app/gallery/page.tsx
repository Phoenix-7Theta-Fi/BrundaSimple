import { Container, Grid, Heading } from "@radix-ui/themes";
import Navigation from "@/components/Navigation";
import ImageCard from "@/components/ImageCard";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

async function getImages() {
  try {
    const client = await clientPromise;
    const db = client.db("trading-journal");
    const images = await db.collection("images")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return images;
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return [];
  }
}

export default async function Gallery() {
  const images = await getImages();

  return (
    <>
      <Navigation />
      <Container>
        <Heading size="8" align="center" mb="6">
          Trading Charts Gallery
        </Heading>
        <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
          {images.map((image: any) => (
            <ImageCard
              key={image._id.toString()}
              imageUrl={image.imageUrl}
              uploadedAt={image.uploadedAt}
            />
          ))}
        </Grid>
        {images.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No images uploaded yet. Start by uploading some trading charts!
          </p>
        )}
      </Container>
    </>
  );
}
