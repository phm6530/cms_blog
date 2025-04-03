export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  result: T;
};
