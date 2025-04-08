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

export const withFetchRevaildationAction = async <T>({
  endPoint,
  tags,
  requireAuth,
  options,
}: ActionsProps): Promise<SuccessResponse<T> | ErrorResponse> => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("authjs.session-token");

  // 헤더 구성
  const headers: HeadersInit = {
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...(requireAuth &&
      authCookie && { Authorization: `Bearer ${authCookie.value}` }),
    ...options?.headers,
  };

  try {
    // API 요청 실행
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endPoint}`,
      {
        ...options,
        headers,
      }
    );

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

    if (tags && tags.length > 0) {
      for (const tag of tags) {
        revalidateTag(tag);
      }
    }

    const { result }: { result: T } = await response.json();

    return {
      success: true,
      result: result,
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
