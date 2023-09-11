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
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, undefined, {
      duration: 5000,
    });
  }

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
}
