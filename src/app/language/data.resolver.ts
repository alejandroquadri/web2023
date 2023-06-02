import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, firstValueFrom } from 'rxjs';

import { EcomService, ServerDetectService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class DataResolver implements Resolve<any> {
  constructor(
    private serverDetectSc: ServerDetectService,
    private ecomSc: EcomService
  ) {}

  resolve(): Promise<any> | any {
    if (this.serverDetectSc.isBrowserSide()) {
      console.log('no es server, voy derecho en lang service');
      return Promise.resolve(null);
    } else {
      return firstValueFrom(this.ecomSc.getProducts());
    }
  }
}
