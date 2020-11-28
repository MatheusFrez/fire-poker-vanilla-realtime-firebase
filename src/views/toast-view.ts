import View from './view';
import { toast } from 'materialize-css';

export default class ToastView extends View {
  protected template (): string {
    return `
    `;
  }

  public showSuccessMessage (title: string, message: string) {
    return toast({
      inDuration: 500,
      html: `
        <div style="text-align: center;">
          <h2 style="font-size: 20px; color: green;">${title}</h2>
          <p>${message}</p>
        </div>
      `,
      outDuration: 500,
    });
  }

  public showErrorMessage (title: string, message: string) {
    return toast({
      inDuration: 500,
      html: `
        <div style="text-align: center;">
          <h2 style="font-size: 20px; color: red;">${title}</h2>
          <p>${message}</p>
        </div>
      `,
      outDuration: 500,
    });
  }

  public showinfoMessage (title: string, message: string) {
    return toast({
      inDuration: 500,
      html: `
        <div style="text-align: center;">
          <h2 style="font-size: 20px; color: yellow;">${title}</h2>
          <p>${message}</p>
        </div>
      `,
      outDuration: 500,
    });
  }
}
