import { toast } from "react-toastify";

export const successToast = (message?: string) => {
  toast(message || "Updated Successfully", {
    type: "success",
  });
};

export const errorToast = (message?: string) => {
  toast(message || "Something went wrong", {
    type: "error",
  });
};
