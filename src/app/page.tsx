import ImageUploader from "@/components/ImageUploader";
import Navigation from "@/components/Navigation";
import { Container, Heading } from "@radix-ui/themes";

export default function Home() {
  return (
    <>
      <Navigation />
      <Container>
        <Heading size="8" align="center" mb="6">
          Trading Journal
        </Heading>
        <ImageUploader />
      </Container>
    </>
  );
}
