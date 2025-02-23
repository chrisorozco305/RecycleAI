"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>(""); // JSON text content
  const [loading, setLoading] = useState<boolean>(false); // Track API status
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Detect if the user is on a mobile device
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setJsonText(""); // Clear previous JSON result
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("📤 Sending image to Flask...");

      const response = await fetch("http://127.0.0.1:5001/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify image");
      }

      console.log("✅ Image classified. Fetching JSON result...");
      fetchResult();
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setJsonText("Error classifying image.");
      setLoading(false);
    }
  };

  const fetchResult = async () => {
    try {
      console.log("📡 Fetching JSON result from Flask...");
  
      const response = await fetch("http://127.0.0.1:5001/get_result", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("✅ JSON Response:", data); // Debugging in console
  
      // Extracting classification result text
      if (data.classification) {
        setJsonText(`Classification: ${data.classification}\nObjects: ${data.objects}\nLabels: ${data.labels.join(", ")}`);
      } else {
        setJsonText("Invalid JSON format received.");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setJsonText("Error loading classification result.");
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-white p-4">
      <div className="flex-grow flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mt-4">RecycleAI</h1>

        <Card className="w-full max-w-md bg-gray-900 text-white mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-300">
              RecycleAI helps you identify recyclable items using AI, making the world more sustainable.
            </p>
          </CardContent>
        </Card>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={isMobile ? "environment" : undefined}
          className="hidden"
          onChange={handleCapture}
        />

        {/* Display Captured Image */}
        {image && (
          <div className="relative mt-4">
            <h2 className="text-lg font-semibold text-center">Captured Image:</h2>
            <div className="relative">
              <img src={image} alt="Captured" className="w-full max-w-xs mt-2 rounded-lg shadow-md" />
            </div>
          </div>
        )}
{/* TEXT BOX TO DISPLAY JSON RESULT */}
<div className="mt-4 w-full max-w-md">
  <h3 className="text-lg font-semibold">Classification Result</h3>
  <textarea
    className="w-full h-32 p-2 border border-gray-600 bg-gray-800 rounded-md text-white"
    readOnly
    value={loading ? "Processing image..." : jsonText} // Shows extracted text
  />
</div>
        {/* Camera / Upload Button */}
        <div className="w-full flex justify-center mt-6">
          <Button
            onClick={openFilePicker}
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-gray-800 text-white"
            disabled={loading}
          >
            {isMobile ? <Camera className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
            <span className="sr-only">{isMobile ? "Open Camera" : "Upload Image"}</span>
          </Button>
        </div>
      </div>
    </main>
  );
}