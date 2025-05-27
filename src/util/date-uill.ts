import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone"; // timezone 플러그인 추가
import utc from "dayjs/plugin/utc"; // timezone 사용하려면 utc도 필요함
import "dayjs/locale/ko"; // 한국어 로케일

// 플러그인 활성화
dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

type DateFormat =
  | "YYYY-MM-DD"
  | "YYYY년 MM월 DD일"
  | "YYYY.MM.DD"
  | "HH:mm:ss"
  | "YYYY-MM-DD HH:mm:ss"
  | string;

export class DateUtils {
  private static today = dayjs().tz("Asia/Seoul");

  // 시간 + 날짜
  static parseKoreanDate(date: string | Date, locale = "en") {
    return dayjs(date).tz("Asia/Seoul").locale(locale);
  }

  // 날짜만 비교
  static parseKoreanDateDay(date: string | Date) {
    return this.parseKoreanDate(date).startOf("day");
  }

  static dateFormatKR(date: string | Date, format: DateFormat) {
    return this.parseKoreanDate(date).format(format);
  }

  static isAfter(date: string): boolean {
    return this.today.isAfter(this.parseKoreanDateDay(date), "day");
  }

  static formatStyledShort(date: string | Date) {
    return this.parseKoreanDate(date).format("MMM D, YYYY");
  }

  static isBefore(date: string) {
    return this.today.isBefore(this.parseKoreanDateDay(date), "day");
  }

  static isSame(date: string) {
    return this.today.isSame(this.parseKoreanDateDay(date), "day");
  }

  static isNew(date: string | Date) {
    const diffDays = this.today.diff(this.parseKoreanDateDay(date), "day");
    return diffDays >= 0 && diffDays < 7;
  }

  static isToday(date: string | Date) {
    const diffDays = this.today.diff(this.parseKoreanDateDay(date), "day");
    return diffDays === 0;
  }

  static krUTC() {
    const startOfToday = dayjs().tz("Asia/Seoul").startOf("day").utc().toDate();
    const endOfToday = dayjs().tz("Asia/Seoul").endOf("day").utc().toDate();
    return {
      startOfToday,
      endOfToday,
    };
  }

  static fromNow(date: string) {
    return this.parseKoreanDate(date, "kr").fromNow();
  }

  /**
   * 두 날짜 사이의 일수 차이를 계산합니다. (종료일 - 시작일)
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * @returns 두 날짜 사이의 일수 (종료일 포함)
   */
  static getDurationDays(
    startDate: string | Date,
    endDate: string | Date
  ): number {
    const start = this.parseKoreanDate(startDate);
    const end = this.parseKoreanDate(endDate);

    // 종료일도 포함하는 경우 +1 (예: 5월 1일부터 5월 3일까지는 3일)
    return end.diff(start, "day") + 1;
  }

  /**
   * 두 날짜 사이의 기간을 '00일' 형식의 문자열로 반환합니다.
   * @param startDate 시작 날짜
   * @param endDate 종료 날짜
   * @returns '00일' 형식의 문자열
   */
  static getFormattedDuration(
    startDate: string | Date,
    endDate: string | Date
  ): string {
    const days = this.getDurationDays(startDate, endDate);
    return `${days}일`;
  }
}
