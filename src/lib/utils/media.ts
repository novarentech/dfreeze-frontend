import { ENV_SERVER } from "../../config/env.server";


export function getThumbnailUrl(thumbnail?: any): string | null {
  if (!thumbnail) return null;

  const formats = thumbnail.formats ?? {};

  const mediaUrl =
    formats.medium?.url ||
    formats.small?.url ||
    formats.large?.url ||
    thumbnail.url ||
    null;

  if (!mediaUrl) return null;

  if (mediaUrl.startsWith("http")) {
    return mediaUrl;
  }

  return `${ENV_SERVER.MEDIA_BASE_URL}${mediaUrl}`;
}