import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './date-picker.html',
})
export class DatePicker {
  @Input() value: Date | undefined;

  @Input() restrictToFuture = false;

  @Output() valueChange = new EventEmitter<Date | undefined>();

  readonly today = this.startOfDay(new Date());

  get maxDate(): Date {
    const date = new Date(this.today);
    date.setMonth(date.getMonth() + 3);

    return date;
  }

  onDateChange(date: Date | null): void {
    this.valueChange.emit(date ?? undefined);
  }

  private startOfDay(date: Date): Date {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
  }
}