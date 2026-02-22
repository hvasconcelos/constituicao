import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 24, className }: LogoProps) {
  return (
    <Image
      src="/icon-192.png"
      alt="Constituição Portuguesa"
      width={size}
      height={size}
      className={className}
    />
  );
}
