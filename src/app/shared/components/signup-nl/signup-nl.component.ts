import { firstValueFrom } from 'rxjs';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SignUpNlCopy } from '../../copy';
import { CkApiService, LanguageService } from '../../services';

@Component({
  selector: 'app-signup-nl',
  templateUrl: './signup-nl.component.html',
  styleUrls: ['./signup-nl.component.scss'],
})
export class SignupNlComponent implements OnInit {
  @Output() closeDialog = new EventEmitter();
  copy = SignUpNlCopy;
  lang: string;
  form: FormGroup;
  showForm = true;
  showThanks = false;

  constructor(
    private langSc: LanguageService,
    private fb: FormBuilder,
    private ckSc: CkApiService
  ) {
    this.lang = this.langSc.currentLang;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  async buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    // firstValueFrom(
    //   this.ckSc.addSuscribedTag(this.form.value.email, this.form.value.name)
    // ).then(_ => console.log('done'));
    this.showForm = false;
    this.showThanks = true;
    setTimeout(() => {
      this.close();
    }, 5000);
  }

  close() {
    this.closeDialog.emit(true);
  }
}
