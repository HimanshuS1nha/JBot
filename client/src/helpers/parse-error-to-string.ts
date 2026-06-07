import { AxiosError } from "axios";
import { ZodError } from "zod";

export const parseErrorToString = (error: Error) => {
  if (error instanceof ZodError) {
    return error.issues.map((err) => err.message).join(", ");
  } else if (error instanceof AxiosError && error.response?.data.message) {
    return error.response.data.message as string;
  } else {
    return "Some error occured. Please try again later!";
  }
};
