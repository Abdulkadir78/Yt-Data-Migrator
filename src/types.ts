import { AxiosError } from "axios";

export interface Error {
  message: string;
}

export type APIError = AxiosError<{
  error: {
    code: number;
    message: string;
    status?: string;
  };
}>;
