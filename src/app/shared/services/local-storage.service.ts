import { Injectable } from '@angular/core';
import { WindowReferenceService } from './window-reference.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private window;

  constructor(private _windowRef: WindowReferenceService) {
    this.window = _windowRef.nativeWindow;
  }

  public saveData(key: string, value: string) {
    // localStorage.setItem(key, this.encrypt(value));
    this.window.localStorage.setItem(key, value);
  }

  public getData(key: string) {
    let data = this.window.localStorage.getItem(key) || '';
    // return this.decrypt(data);
    return data;
  }
  public removeData(key: string) {
    this.window.localStorage.removeItem(key);
  }

  public clearData() {
    this.window.localStorage.clear();
  }

  // private encrypt(txt: string): string {
  //   return CryptoJS.AES.encrypt(txt, this.key).toString();
  // }

  // private decrypt(txtToDecrypt: string) {
  //   return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  // }
}
