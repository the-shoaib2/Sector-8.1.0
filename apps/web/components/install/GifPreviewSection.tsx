"use client"

import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useState } from "react"

export default function GifPreviewSection() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="w-full bg-muted/40 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl shadow-lg">
          {!imgError ? (
            <Image
              src="/placeholder.jpg"
              alt="B.A.B.Y. Preview GIF"
              fill
              className="object-cover"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-lg">
              No preview available
            </div>
          )}
        </AspectRatio>
      </div>
    </section>
  )
} 