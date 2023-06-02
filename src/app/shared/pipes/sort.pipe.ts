import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(
    value: any[],
    order?: 'asc' | 'desc',
    column?: string,
    keyValue?: boolean
  ): any[] {
    if (!value || !order) {
      return value;
    } // no array
    if (value.length <= 1) {
      return value;
    } // array with only one item
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    } // sort 1d array
    return this.orderBy(value, column, order, keyValue);
  }

  orderBy(
    array: Array<any>,
    column: string,
    order: 'asc' | 'desc',
    keyValue?: boolean
  ) {
    return array.sort((a: any, b: any) => {
      const dirFactor = order === 'asc' ? 1 : -1;
      const first = keyValue ? a.value[column] : a[column];
      const second = keyValue ? b.value[column] : b[column];

      if (first < second) {
        return -1 * dirFactor;
      } else if (first > second) {
        return 1 * dirFactor;
      } else {
        return 0;
      }
    });
  }
}
