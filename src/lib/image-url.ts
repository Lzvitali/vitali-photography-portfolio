export function fullUrl(url: string): string {
  if (!url) return "";
  return url.replace("/upload/", "/upload/f_auto,q_auto:best/");
}

/** @deprecated Use fullUrl or thumbnailUrl instead */
export const optimizedUrl = fullUrl;

export function thumbnailUrl(url: string, width = 800): string {
  if (!url) return "";
  return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto:best/`);
}

export function cloudinaryUrl(
  publicId: string,
  transforms: string = "f_auto,q_auto:best"
): string {
  const cloudName = "drtzu6ywv";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`;
}
