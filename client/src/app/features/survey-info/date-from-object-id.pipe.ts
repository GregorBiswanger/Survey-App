import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFromObjectId'
})
export class DateFromObjectIdPipe implements PipeTransform {

  transform(id: string, ...args: unknown[]): Date {
    const timehex = id.substring(0, 8);
    const secondsSinceEpoch = parseInt(timehex, 16);

    const date = new Date(secondsSinceEpoch * 1000);
    return date;
  }

}
