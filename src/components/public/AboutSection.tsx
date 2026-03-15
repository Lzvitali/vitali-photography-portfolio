"use client";

import { thumbnailUrl } from "@/lib/image-url";
import type { FocalPoint, PortraitStyle } from "@/lib/types";

interface AboutSectionProps {
  about: string;
  portraitUrl: string;
  name: string;
  portraitStyle?: PortraitStyle;
  portraitFocalPoint?: FocalPoint;
}

function PortraitImage({
  src,
  alt,
  style,
  focalPoint,
}: {
  src: string;
  alt: string;
  style: PortraitStyle;
  focalPoint: FocalPoint;
}) {
  const pos = `${focalPoint.x}% ${focalPoint.y}%`;

  switch (style) {
    case "circle":
      return (
        <div className="w-[130px] h-[130px] flex-shrink-0 rounded-full shadow-[0_0_0_3px_var(--bg-circle),0_0_0_5px_#c5c0b8] dark:shadow-[0_0_0_3px_var(--bg-circle-dark),0_0_0_5px_#555] overflow-hidden"
          style={{
            "--bg-circle": "#faf9f6",
            "--bg-circle-dark": "#1a1a18",
          } as React.CSSProperties}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
        </div>
      );

    case "rounded":
      return (
        <div className="w-[120px] h-[150px] flex-shrink-0 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
          <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
        </div>
      );

    case "polaroid":
      return (
        <div className="flex-shrink-0 bg-white dark:bg-neutral-100 p-2 pb-7 rounded-[2px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] -rotate-2 hover:rotate-0 transition-transform duration-300">
          <div className="w-[110px] h-[140px] overflow-hidden rounded-[1px]">
            <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
          </div>
        </div>
      );

    case "offset":
      return (
        <div className="flex-shrink-0 relative w-[120px] h-[150px]">
          <div className="absolute top-2 left-2 -right-2 -bottom-2 border-2 border-neutral-300 dark:border-neutral-600 rounded" />
          <div className="relative z-[1] w-[120px] h-[150px] rounded overflow-hidden">
            <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
          </div>
        </div>
      );

    case "centered":
      return (
        <div className="w-[160px] h-[160px] rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden mx-auto mb-6">
          <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
        </div>
      );

    case "blob":
      return (
        <div className="w-[140px] h-[140px] flex-shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden"
          style={{ borderRadius: "60% 40% 50% 45% / 45% 55% 40% 60%" }}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
        </div>
      );

    default:
      return (
        <img
          src={src}
          alt={alt}
          className="w-20 h-26 md:w-26 md:h-34 object-cover rounded-sm flex-shrink-0"
          style={{ objectPosition: pos }}
          loading="lazy"
        />
      );
  }
}

export default function AboutSection({
  about,
  portraitUrl,
  name,
  portraitStyle = "default",
  portraitFocalPoint = { x: 50, y: 50 },
}: AboutSectionProps) {
  const imgUrl = portraitUrl ? thumbnailUrl(portraitUrl, 400) : "";
  const isCentered = portraitStyle === "centered";

  return (
    <section
      id="about"
      className={`max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24 flex ${
        isCentered
          ? "flex-col items-center text-center"
          : "flex-col md:flex-row items-center gap-8 md:gap-14"
      }`}
    >
      {imgUrl && (
        <PortraitImage
          src={imgUrl}
          alt={name}
          style={portraitStyle}
          focalPoint={portraitFocalPoint}
        />
      )}
      <div className={isCentered ? "max-w-lg" : "text-center md:text-left"}>
        <h2 className="font-display text-2xl md:text-3xl font-light mb-4 tracking-wide">
          About
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-[0.95rem]">
          {about}
        </p>
      </div>
    </section>
  );
}
