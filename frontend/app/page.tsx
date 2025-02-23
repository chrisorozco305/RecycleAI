"use client";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [objectName, setObjectName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const GOOGLE_CLOUD_VISION_API_KEY = "AIzaSyAr4BtkoZzIZFmRQOVhRhxFW2BpQBFgxDc"; // Replace this with your actual API key

  // Function to open the file input (triggers the camera)
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle image capture and send it to Google Cloud Vision
  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result?.toString().split(",")[1]; // Get Base64 part

        if (base64Image) {
          setImage(URL.createObjectURL(file)); // Display image preview

          // Send image to Google Cloud Vision API
          const visionResponse = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requests: [
                  {
                    image: { content: base64Image },
                    features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
                  },
                ],
              }),
            }
          );

          const visionData = await visionResponse.json();
          if (visionData.responses[0]?.labelAnnotations) {
            const detectedObject = visionData.responses[0].labelAnnotations[0].description;
            setObjectName(detectedObject);
          } else {
            setObjectName("No object detected");
          }
        }
      };
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

        {/* Display Detected Object Name */}
        {objectName && (
          <p className="text-center text-lg font-semibold mt-2">Detected Object: {objectName}</p>
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
