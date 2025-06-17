import { isAxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAxiosErrorMessage(
  error: unknown,
  defaultMessage: string = "Something went wrong"
) {
  if (isAxiosError(error)) {
    return error.response?.data.message || defaultMessage;
  }
  return defaultMessage;
}
