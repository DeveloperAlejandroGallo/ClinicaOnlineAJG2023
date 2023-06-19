import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateisoToDate'
})
export class DateisoToDatePipe implements PipeTransform {

  transform(fecha: string): Date {
    return new Date(fecha);
  }

}
