import {
  Injectable,
  makeStateKey,
  StateKey,
  TransferState,
} from '@angular/core';

import { Observable, of, Subject, take } from 'rxjs';
import { switchMap, tap, startWith, filter } from 'rxjs/operators';

import { ServerDetectService } from './server-detect.service';

@Injectable({
  providedIn: 'root',
})
export class DataStateService {
  constructor(
    private tState: TransferState,
    private serverDetectSc: ServerDetectService
  ) {}

  // esto no se usa mas en favor aparentemente del Hydration

  checkAndGetData(
    key: string,
    getDataObservable: Observable<any>
  ): Observable<any> {
    const stateKey = this.getDynamicStateKey(key);

    if (this.tState.hasKey(stateKey)) {
      return of(this.tState.get(stateKey, null));
    } else {
      return getDataObservable.pipe(
        tap(data => {
          if (this.serverDetectSc.isServerSide()) {
            // console.log('guardo state key');
            this.tState.set(stateKey, data);
          }
        })
      );
    }
  }

  getDynamicStateKey(key: string): StateKey<void> {
    return makeStateKey(key);
  }
}
