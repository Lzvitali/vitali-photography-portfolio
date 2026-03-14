import { thumbnailUrl } from "@/lib/image-url";

interface AboutSectionProps {
  about: string;
  portraitUrl: string;
  name: string;
}

export default function AboutSection({
  about,
  portraitUrl,
  name,
}: AboutSectionProps) {
  const imgUrl = portraitUrl ? thumbnailUrl(portraitUrl, 400) : "";

  return (
    <section
      id="about"
      className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-14"
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt={name}
          className="w-20 h-26 md:w-26 md:h-34 object-cover rounded-sm flex-shrink-0"
          loading="lazy"
        />
      )}
      <div className="text-center md:text-left">
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
