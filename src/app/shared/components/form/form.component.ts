import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  LanguageService,
  CookiesService,
  DateFnsService,
  UploadService,
  UploadObj,
} from 'src/app/shared/services';

import { FormService } from './form.service';
import { ContactForm } from '../../copy';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() origin?: string;
  @Output() submitEmiter = new EventEmitter();

  form: FormGroup;
  lang: string;
  formCopy = ContactForm;

  uploadPercent: Observable<number>;
  downloadUrlArray: any;
  uploading = false;
  sending = false;
  viewFiles:
    | Record<
        string,
        {
          id?: string;
          name?: string;
          running?: boolean;
          url: string;
          percentage?: number;
        }
      >
    | {};
  tasks = [];

  constructor(
    private fb: FormBuilder,
    private formSc: FormService,
    private langSc: LanguageService,
    private cookiesSc: CookiesService,
    private dateFnsSc: DateFnsService,
    private uploadSc: UploadService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
    this.buildForm();
  }

  async buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      query: ['', Validators.required],
    });
  }

  onSubmit() {
    this.sending = true;
    const cookieObj = this.cookiesSc.getCookieObj();
    let query = {
      ...this.form.value,
      ...cookieObj,
      origin: 'web',
    };

    if (this.viewFiles) {
      query = { ...query, files: this.viewFiles };
    }
    this.formSc
      .saveQuery(query)
      .then(() => {
        this.cookiesSc.deleteCookie();
        this.sending = false;
        this.submitEmiter.emit('submit');
        this.form.reset();
        this.viewFiles = {};
        this.openSnackBar(
          'Recibimos tu consulta! En breve te estaremos contestando'
        );
      })
      .catch(err => {
        this.submitEmiter.emit('error');
        this.openSnackBar('Hubo un error enviando tu consulta');
      });
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
    });
  }

  // uploadFilesV(e) {
  //   this.uploading = true;
  //   if (!this.viewFiles) {
  //     this.viewFiles = {};
  //   } else {
  //     this.viewFiles = { ...this.viewFiles };
  //   }
  //   const targetFiles = e.target.files;
  //   Object.keys(targetFiles).forEach((file: any) => {
  //     const id = this.db.getUniqueId();
  //     this.viewFiles[id] = {
  //       id,
  //       name: targetFiles[file].name,
  //     };
  //     // this.uploadAngularFire(targetFiles[file], id);
  //   });

  //   Promise.all(this.tasks).then(() => {
  //     this.uploading = false;
  //   });
  // }

  uploadFiles(e) {
    this.uploading = true;
    if (!this.viewFiles) {
      this.viewFiles = {};
    } else {
      this.viewFiles = { ...this.viewFiles };
    }
    const targetFiles = e.target.files;
    Object.keys(targetFiles).forEach((file: any) => {
      const id = this.formSc.getId();
      this.viewFiles[id] = {
        id,
        name: targetFiles[file].name,
        running: true,
      };
      this.upload(targetFiles[file], id);
    });

    this.uploadSc.uploadState$.subscribe((uploadObj: UploadObj) => {
      console.log(uploadObj);
      this.viewFiles[uploadObj.id].running = uploadObj.running;
      this.viewFiles[uploadObj.id].percentage = uploadObj.percentage;
      this.viewFiles[uploadObj.id].url = uploadObj.url;
      let uploading = false;
      for (const [key, value] of Object.entries(this.viewFiles)) {
        if (value.running) {
          uploading = true;
          break;
        }
      }
      if (!uploading) {
        this.uploading = false;
      }
    });

    // Promise.all(this.tasks).then(() => {
    //   this.uploading = false;
    // });
  }

  upload(blob, id?) {
    const filePath = `web/client_files/${this.dateFnsSc.getFormatedDate(
      new Date(),
      'yyyyMMddhhmm'
    )}${blob.name}`;
    this.uploadSc.uploadAngularFire(blob, filePath, id);
  }

  // uploadAngularFireV(blob, id) {
  //   const filePath = `web/client_files/${this.dateFnsSc.getFormatedDate(
  //     new Date(),
  //     'yyyyMMddhhmm'
  //   )}${blob.name}`;
  //   const fileRef = this.storageV.ref(filePath);
  //   const task = this.storageV.upload(filePath, blob);

  //   this.tasks.push(task);
  //   this.uploadPercent = task.percentageChanges();

  //   this.uploadPercent.subscribe(per => {
  //     this.viewFiles[id].running = true;
  //     this.viewFiles[id].percentage = per;
  //   });

  //   // get notified when the download URL is available
  //   task
  //     .snapshotChanges()
  //     .pipe(
  //       finalize(async () => {
  //         const url = await firstValueFrom(fileRef.getDownloadURL());
  //         this.viewFiles[id].url = url;
  //         this.viewFiles[id].running = false;
  //       })
  //     )
  //     .subscribe();
  // }
}
