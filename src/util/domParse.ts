import * as cheerio from "cheerio";

// 서버에서 추출 가능하도록 변형
export default function transformHtmlToPlainText({ html }: { html: string }) {
  const $ = cheerio.load(html);
  const plainText = $.text();
  return plainText.slice(0, 500);
}
