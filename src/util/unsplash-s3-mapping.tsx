import { ENV } from "@/type/constants";

export const unsplashS3Mapping = (url: string | null) => {
  return url !== null && !url?.startsWith("https://images.unsplash.com")
    ? `${ENV.IMAGE_URL_PUBLIC}${url}`
    : url;
};
