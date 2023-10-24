import { AxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/ban-types
export function isAxiosError<T extends {}>(
  err: AxiosError<T> | Error | unknown
): err is AxiosError<T> {
  return (err as AxiosError) !== undefined;
}
