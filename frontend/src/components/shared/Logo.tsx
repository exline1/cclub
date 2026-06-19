import Image from "next/image";
import Link from "next/link";

import { IMAGE_PATHS } from "@/lib/assets";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  href?: string;
}

/**
 * Logotip komponenti — faqat public/logo.png faylini almashtiring.
 */
export function Logo({
  className,
  imageClassName,
  showText = true,
  href = "/",
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg sm:h-11 sm:w-11">
        <Image
          src={IMAGE_PATHS.logo}
          alt="GameClub Hub logotipi"
          fill
          sizes="44px"
          className={cn("object-contain", imageClassName)}
          priority
        />
      </div>
      {showText && (
        <span className="font-heading text-base font-bold tracking-tight text-text-primary sm:text-lg">
          GameClub Hub
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity duration-200 hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
