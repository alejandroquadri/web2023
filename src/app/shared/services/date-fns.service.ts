import { Injectable } from '@angular/core';
import { format, compareAsc } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateFnsService {
  constructor() {}

  getFormatedDate(date: number | string | Date, formatType?: string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!formatType) {
      formatType = 'yyyy-MM-dd';
    }
    // aca estan todos los formatos https://date-fns.org/v2.28.0/docs/format
    return format(date, formatType);
  }
}
