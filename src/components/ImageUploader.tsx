"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

export default function ImageUploader() {
  const router = useRouter();

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload Trading Chart</h2>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            router.refresh(); // Refresh the page to show new upload
            alert("Upload completed successfully!");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          className="ut-button:bg-blue-500 ut-button:hover:bg-blue-600"
        />
      </div>
    </div>
  );
}
