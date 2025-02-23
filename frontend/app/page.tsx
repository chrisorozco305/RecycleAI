"use client";
import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Function to request and display camera feed
  const openCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to capture an image from the camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageDataUrl = canvasRef.current.toDataURL("image/png");
        setImage(imageDataUrl);
      }

      // Stop the camera after capturing
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex-grow flex flex-col items-center justify-between">
        <h1 className="text-3xl font-bold text-center mt-8 mb-6">RecycleAI</h1>

        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600">
              RecycleAI is committed to making recycling easier and more accessible. Our app uses artificial
              intelligence to help you identify recyclable items and learn proper recycling practices, contributing to a
              cleaner and more sustainable world.
            </p>
          </CardContent>
        </Card>

        {/* Camera Preview Section */}
        {isCameraOpen && (
          <div className="flex flex-col items-center mt-4">
            <video ref={videoRef} autoPlay className="w-full max-w-sm rounded-lg" />
            <canvas ref={canvasRef} className="hidden" width={640} height={480} />
            <Button onClick={captureImage} className="mt-4">
              Capture Image
            </Button>
          </div>
        )}

        {/* Display Captured Image */}
        {image && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Captured Image:</h2>
            <img src={image} alt="Captured" className="w-full max-w-xs mt-2 rounded-lg shadow-md" />
          </div>
        )}

        {/* Camera Button */}
        <div className="w-full flex justify-center mt-auto mb-8">
          <Button onClick={openCamera} size="lg" className="rounded-full w-16 h-16 p-0">
            <Camera className="w-8 h-8" />
            <span className="sr-only">Open camera</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
