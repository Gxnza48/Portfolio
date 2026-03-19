"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectPreviewProps {
  image: string;
  title: string;
}

export default function ProjectPreview({ image, title }: ProjectPreviewProps) {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded overflow-hidden bg-brand-surface border border-white/5 mb-8 group-hover:border-brand-primary/20 transition-colors z-10 shadow-lg">
      {!error ? (
        <Image
          src={image}
          alt={`Preview of ${title}`}
          fill
          unoptimized={true}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-brand-bg/80 text-center space-y-4">
          <span className="text-brand-muted/80 font-mono text-sm uppercase tracking-widest">{title}</span>
        </div>
      )}
      
      {/* Overlay gradient for styling */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/60 via-transparent to-transparent opacity-80 pointer-events-none" />
    </div>
  );
}
