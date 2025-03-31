"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type ActionsProps = {
  endPoint: string;
  tags?: string[];
  requireAuth?: boolean;
  options?: RequestInit;
};

type SuccessResponse<T> = {
  success: true;
  result: T;
  message?: undefined;
  statusCode?: number;
};

type ErrorResponse = {
  success: false;
  result?: undefined;
  message: string;
  statusCode?: number;
};

// BASE_NEST_URL은 환경변수로 관리합니다.
const BASE_NEST_URL = process.env.BASE_NEST_URL;
if (!BASE_NEST_URL) {
  throw new Error("BASE_NEST_URL is not defined");
}

export const withFetchRevaildationAction = async <T>({
  endPoint,
  tags,
  requireAuth,
  options,
}: ActionsProps): Promise<SuccessResponse<T> | ErrorResponse> => {
  // Cookie 가져오기
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("token");

  // 인증 필요시 토큰 체크
  if (requireAuth && !authCookie) {
    return {
      success: false,
      message: "인증 토큰이 없습니다.",
      statusCode: 401,
    };
  }

  // 헤더 구성
  const headers: HeadersInit = {
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...(requireAuth && authCookie
      ? { Authorization: `Bearer ${authCookie.value}` }
      : {}),
    ...options?.headers,
  };

  try {
    // API 요청 실행
    const response = await fetch(`${BASE_NEST_URL}/${endPoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const statusCode = errorData.statusCode || response.status;

      if (statusCode === 404) {
        throw new Error("잘못된 요청이거나 없는 페이지입니다.");
      }
      if (statusCode === 401) {
        throw new Error("권한이 없거나 만료된 토큰입니다.");
      }
      throw new Error(errorData.message || "Request Failed");
    }

    // 태그가 있다면 리밸리데이션 실행
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        revalidateTag(tag);
      }
    }

    // 응답 JSON 파싱 후 반환
    const resultData = await response.json();
    return {
      success: true,
      result: resultData,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        statusCode: 500,
      };
    }
    return {
      success: false,
      message: "서버에 문제가 있습니다.",
      statusCode: 500,
    };
  }
};
