"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ImageUploader() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const saveImageMetadata = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/images/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          tradingDate: selectedDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save image metadata');
      }

      return true;
    } catch (error) {
      console.error('Error saving image metadata:', error);
      return false;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Upload Trading Chart</h2>
        
        <div className="mb-4">
          <label 
            htmlFor="tradingDate" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Trading Date
          </label>
          <input
            type="date"
            id="tradingDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div
          className={`transition-all duration-300 ease-in-out 
            ${isHovered ? 'transform scale-105' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={async (res) => {
              if (res?.[0]) {
                const success = await saveImageMetadata(res[0].url);
                if (success) {
                  setIsUploading(false);
                  router.refresh();
                  alert("Upload completed successfully!");
                } else {
                  alert("Image uploaded but failed to save metadata. Please try again.");
                }
              }
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              alert(`ERROR! ${error.message}`);
            }}
            className={`ut-button:bg-blue-500 ut-button:hover:bg-blue-600 
              ut-upload-icon:transition-transform ut-upload-icon:duration-300
              ${isUploading ? 'ut-upload-icon:animate-bounce' : ''}
              ${isHovered ? 'ut-upload-icon:scale-125 border-blue-500' : 'border-gray-300'}
              min-h-[200px] border-2 border-dashed
              transition-all duration-300 ease-in-out`}
          />
        </div>
      </div>
    </div>
  );
}
