import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandWordmark({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/girtz-wordmark.svg"
      width={1200}
      height={320}
      alt="GIRTZ"
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

export function BrandMark({ className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/brand/girtz-mark.svg"
      width={1024}
      height={1024}
      alt=""
      aria-hidden="true"
      className={className}
      unoptimized
    />
  );
}
