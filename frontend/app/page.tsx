"use client";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to trigger the file input
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle image capture
  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex-grow flex flex-col items-center justify-between">
        <h1 className="text-2xl font-bold text-center mt-4">RecycleAI</h1>

        <Card className="w-full max-w-md bg-gray-900 text-white">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-300">
              RecycleAI helps you identify recyclable items using AI, making the world more sustainable.
            </p>
          </CardContent>
        </Card>

        {/* Hidden File Input for Camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleCapture}
        />

        {/* Display Captured Image */}
        {image && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-center">Captured Image:</h2>
            <img src={image} alt="Captured" className="w-full max-w-xs mt-2 rounded-lg shadow-md" />
          </div>
        )}

        {/* Camera Button */}
        <div className="w-full flex justify-center mt-auto mb-8">
          <Button onClick={openCamera} size="lg" className="rounded-full w-16 h-16 p-0 bg-gray-800 text-white">
            <Camera className="w-8 h-8" />
            <span className="sr-only">Open camera</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
