import { Toast, toast as mToast } from 'materialize-css';

const toast = (message: string) => {
  Toast.dismissAll();
  mToast({
    html: message,
  });
};

export default toast;
