import { Injectable, inject } from '@angular/core';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';

import { DateFnsService } from 'src/app/shared/services';

export interface UploadObj {
  id: string;
  percentage: number;
  running: boolean;
  url: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly storage: Storage = inject(Storage);
  // uploadState: Record<
  //   string,
  //   { progress: number; completed: boolean; url: string | null }
  // > = {};
  // uploadState$: Subject<
  //   Record<string, { progress: number; completed: boolean; url: string | null }>
  // > = new Subject();
  uploadState$: Subject<UploadObj> = new Subject();

  constructor() {}

  uploadAngularFire(blob, filePath, id?) {
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload ${id} progress ${progress} % done`);
        this.uploadState$.next({
          id: id || filePath,
          percentage: progress,
          running: true,
          url: null,
        });
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      error => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          // console.log('File available at', downloadURL);
          this.uploadState$.next({
            id: id || filePath,
            percentage: 100,
            running: false,
            url: downloadURL,
          });
        });
      }
    );
  }
}
