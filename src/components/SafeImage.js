import Image from "next/image";

export default function SafeImage({
  src,
  alt = "",
  width,
  height,
  className,
  ...rest
}) {
  const clean =
    typeof src === "string"
      ? src.trim().replace(/^['"`\s]+|['"`\s]+$/g, "")
      : "";
  return (
    <Image
      src={clean}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      {...rest}
    />
  );
}
