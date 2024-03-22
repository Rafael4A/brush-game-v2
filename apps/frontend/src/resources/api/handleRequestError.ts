import { AxiosError, isAxiosError } from "axios";
import { toast } from "react-toastify";

import { RequestError, getRequestErrorMessage } from ".";

export function handleRequestError(error: unknown, fallbackMessage: string) {
  if (isAxiosError(error)) {
    const { response } = error as AxiosError<RequestError>;

    toast.error(getRequestErrorMessage(response?.data));
  } else {
    toast.error(fallbackMessage);
  }
}
