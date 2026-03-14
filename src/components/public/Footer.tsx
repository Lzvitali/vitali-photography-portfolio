import { Instagram, Mail, Music2 } from "lucide-react";
import type { SiteContact } from "@/lib/types";

interface FooterProps {
  name: string;
  contact: SiteContact;
}

export default function Footer({ name, contact }: FooterProps) {
  return (
    <footer
      id="contact"
      className="border-t border-neutral-200 dark:border-neutral-800 py-12 px-5 md:px-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center gap-5 mb-6">
          {contact.instagram && (
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          )}
          {contact.tiktok && (
            <a
              href={contact.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="TikTok"
            >
              <Music2 size={18} />
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-11 h-11 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-transparent transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 tracking-wide">
          {name}
          {contact.email && <> &middot; {contact.email}</>}
          {contact.phone && <> &middot; {contact.phone}</>}
        </p>
      </div>
    </footer>
  );
}
