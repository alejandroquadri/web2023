import {
  Component,
  OnInit,
  Optional,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformServer, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

import { LanguageService } from 'src/app/shared/services';
import { NotFound } from 'src/app/shared/copy';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  lang: string;
  copy = NotFound;

  constructor(
    private router: Router,
    private langSc: LanguageService,
    // @Optional() @Inject(REQUEST) private request: Request,
    // @Optional() @Inject(RESPONSE) private response: Response,
    @Inject(PLATFORM_ID) private platformId: any // @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    // if (isPlatformServer(this.platformId)) {
    //   this.response.status(404);
    // }
  }
}
