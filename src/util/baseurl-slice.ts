import { ENV } from "@/type/constants";

// 메모이제이션으로 변경
export class HtmlContentNormalizer {
  private static readonly imgSrcRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;

  static getPost(contents: string) {
    return contents.replace(this.imgSrcRegex, (match, src) => {
      return match.replace(src, src.replaceAll(`${ENV.IMAGE_URL_PUBLIC}`, ""));
    });
  }

  static setImgUrl(contents: string) {
    // 모든 이미지 src 속성 변경
    const modifiedContent = contents.replace(this.imgSrcRegex, (match, src) => {
      return match.replace(src, `${ENV.IMAGE_URL_PUBLIC}${src}`);
    });

    return modifiedContent;
  }
}
