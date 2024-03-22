export interface RequestError {
  message: string | string[];
  statusCode: number;
  error: string;
}

export function getRequestErrorMessage(requestError?: RequestError) {
  if (!requestError) return "Something went wrong";
  return Array.isArray(requestError.message)
    ? requestError.message.join(". ")
    : requestError.message;
}
