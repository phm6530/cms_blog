"use client";

type ClientFetchProps = {
  endPoint: string;
  options?: RequestInit;
  body?: object;
  requireAuth?: boolean;
};

export default async function withClientFetch<T>({
  endPoint,
  options = {},
  requireAuth = false,
  body,
}: ClientFetchProps): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endPoint}`,
      {
        ...options,
        headers,
        ...(requireAuth && { credentials: "include" }),
        ...(body ? { body: JSON.stringify(body) } : {}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data === "object" && data?.message
          ? data.message
          : `Fetch failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "Unknown fetch error");
    }
    throw new Error("Unexpected error");
  }
}
