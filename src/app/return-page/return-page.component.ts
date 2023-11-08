import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LanguageService, StripeService } from '../shared/services';
import { ReturnCopy } from '../shared/copy';

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.scss'],
})
export class ReturnPageComponent implements OnInit {
  sessionData$: Observable<any>;
  copy = ReturnCopy;
  lang: string;

  constructor(
    private route: ActivatedRoute,
    private stripeSc: StripeService,
    private langSc: LanguageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.getSessionData();
  }

  getSessionData() {
    this.sessionData$ = this.route.queryParamMap.pipe(
      switchMap((queryParams: ParamMap) => {
        const sessionId = queryParams.get('session_id');
        if (typeof sessionId === 'string') {
          return this.stripeSc.getSessionData(sessionId);
        } else {
          return of(null);
        }
      }),
      tap(session => console.log(session))
    );
  }
}
