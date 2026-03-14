import { Instagram, Mail, Music2, Phone } from "lucide-react";
import type { SiteContact } from "@/lib/types";

interface FooterProps {
  name: string;
  contact: SiteContact;
}

export default function Footer({ name, contact }: FooterProps) {
  return (
    <footer
      id="contact"
      className="border-t border-neutral-200 dark:border-neutral-700/40 py-12 px-5 md:px-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center gap-7 mb-8">
          {contact.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={26} />
            </a>
          )}
          {contact.tiktok && (
            <a
              href={contact.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="TikTok"
            >
              <Music2 size={26} />
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="Phone"
            >
              <Phone size={26} />
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-16 h-16 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={26} />
            </a>
          )}
        </div>
        <p className="text-lg text-neutral-400 dark:text-neutral-400 tracking-wide">
          {name}
          {contact.email && <> &middot; {contact.email}</>}
          {contact.phone && <> &middot; {contact.phone}</>}
        </p>
      </div>
    </footer>
  );
}
