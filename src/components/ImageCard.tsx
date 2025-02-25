import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { Card, Text } from '@radix-ui/themes';
import Image from 'next/image';

interface ImageCardProps {
  imageUrl: string;
  uploadedAt: string;
}

export default function ImageCard({ imageUrl, uploadedAt }: ImageCardProps) {
  return (
    <Card size="2" style={{ maxWidth: 400 }}>
      <AspectRatio.Root ratio={16 / 9}>
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt="Trading Chart"
            fill
            className="object-cover rounded-t-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </AspectRatio.Root>
      <div className="p-3">
        <Text as="p" size="2" color="gray">
          Uploaded on: {new Date(uploadedAt).toLocaleDateString()}
        </Text>
      </div>
    </Card>
  );
}
