import { Observable, defer } from 'rxjs';

// esta funcion hace un tap sobre la primer emision
export function tapOnlyFirst<T>(callback: () => void) {
  return (source: Observable<T>) =>
    defer(() => {
      callback();
      return source;
    });
}
