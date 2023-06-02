import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

import { ServerDetectService } from 'src/app/shared/services';
import { LookbookService } from './lookbook.service';

@Injectable({ providedIn: 'root' })
export class LookbookResolver implements Resolve<any> {
  constructor(
    private lookbookSc: LookbookService,
    private serverDetectSc: ServerDetectService
  ) {}

  resolve(): Promise<any> | any {
    if (this.serverDetectSc.isBrowserSide()) {
      return Promise.resolve(null);
    } else {
      return firstValueFrom(this.lookbookSc.getLookbook());
    }
  }
}
