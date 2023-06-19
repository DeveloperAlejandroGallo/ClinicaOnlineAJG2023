import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestampADate'
})
export class TimestampADatePipe implements PipeTransform {

  transform(tiempo: Date): Date {
    return new Date(tiempo);
  }

}
