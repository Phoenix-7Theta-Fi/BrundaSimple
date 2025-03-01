'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ImageCardProps {
  id: string;
  imageUrl: string;
  uploadedAt: string;
  tradingDate: string;
}

const DATE_FORMAT_OPTIONS = {
  month: 'numeric' as const,
  day: 'numeric' as const,
  year: 'numeric' as const
};

export default function ImageCard({ id, imageUrl, uploadedAt, tradingDate }: ImageCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        setIsDeleting(true);
        const response = await fetch(
          `/api/images/delete?id=${id}&url=${encodeURIComponent(imageUrl)}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        router.refresh();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-[16/9]">
        <Image
          src={imageUrl}
          alt="Trading Chart"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Trading Date: {formatDate(tradingDate)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Uploaded on: {formatDate(uploadedAt)}
          </p>
          <div className="flex justify-end">
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-md 
                ${isDeleting 
                  ? 'bg-red-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'}`}
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
