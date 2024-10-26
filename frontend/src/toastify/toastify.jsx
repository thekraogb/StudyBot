import { toast } from "react-toastify";

const toastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

export const successToast = (message) => {
  toast.success(message, toastOptions);
};

export const errorToast = (message) => {
  toast.error(message, toastOptions);
};

export const warningToast = (message) => {
  toast.warn(message, toastOptions);
};
