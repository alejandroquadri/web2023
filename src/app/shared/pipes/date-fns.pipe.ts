import { DateFnsService } from './../services/date-fns.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFns',
})
export class DateFnsPipe implements PipeTransform {
  constructor(private dateFnsSc: DateFnsService) {}

  transform(value: number | string | Date, formatType?: string): string {
    return this.dateFnsSc.getFormatedDate(value, formatType);
  }
}
