import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
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

        <div className="w-full flex justify-center mt-auto mb-8">
          <Button size="lg" className="rounded-full w-16 h-16 p-0">
            <Camera className="w-8 h-8" />
            <span className="sr-only">Open camera</span>
          </Button>
        </div>
      </div>
    </main>
  )
}

