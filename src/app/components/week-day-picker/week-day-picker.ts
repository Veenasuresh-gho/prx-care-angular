import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-week-day-picker',
  imports: [MatIconModule],
  templateUrl: './week-day-picker.html',
})
export class WeekDayPicker {
  @Output() dateSelect = new EventEmitter<Date>();

  today = this.startOfDay(new Date());

  month = new Date(this.today);
  pageIndex = 0;
  selectedDate = new Date(this.today);

  get daysToShow(): number {
    if (typeof window === 'undefined') {
      return 7;
    }

    if (window.innerWidth <= 640) {
      return 5;
    }

    if (window.innerWidth <= 1024) {
      return 5;
    }

    return 7;
  }

  get allDates(): Date[] {
    return this.getAllDatesForMonth(this.month);
  }

  get pagesCount(): number {
    return Math.ceil(this.allDates.length / this.daysToShow);
  }

  get visibleDates(): Date[] {
    const start = this.pageIndex * this.daysToShow;

    return this.allDates.slice(
      start,
      start + this.daysToShow
    );
  }

  get currentLabel(): string {
    if (this.visibleDates.length > 0) {
      return this.formatMonthYear(this.visibleDates[0]);
    }

    return this.formatMonthYear(this.month);
  }

  get isAtEarliest(): boolean {
    return (
      this.isSameMonth(this.month, this.today) &&
      this.pageIndex === 0
    );
  }

  private getAllDatesForMonth(month: Date): Date[] {
    const startMonth = new Date(
      month.getFullYear(),
      month.getMonth(),
      1
    );

    const endMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    );

    const dates: Date[] = [];

    for (
      let date = new Date(startMonth);
      date <= endMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const currentDate = new Date(date);

      if (!this.isBefore(currentDate, this.today)) {
        dates.push(currentDate);
      }
    }

    return dates;
  }

  handlePageLeft(): void {
    if (this.isAtEarliest) {
      return;
    }

    if (this.pageIndex === 0) {
      const previousMonth = new Date(this.month);

      previousMonth.setMonth(
        previousMonth.getMonth() - 1
      );

      this.month = previousMonth;

      const previousDates =
        this.getAllDatesForMonth(previousMonth);

      this.pageIndex = Math.max(
        Math.ceil(
          previousDates.length / this.daysToShow
        ) - 1,
        0
      );

      return;
    }

    this.pageIndex--;
  }

  handlePageRight(): void {
    if (this.pageIndex >= this.pagesCount - 1) {
      const nextMonth = new Date(this.month);

      nextMonth.setMonth(
        nextMonth.getMonth() + 1
      );

      this.month = nextMonth;
      this.pageIndex = 0;

      return;
    }

    this.pageIndex++;
  }

  handleMonthLeft(): void {
    if (this.isAtEarliest) {
      return;
    }

    const previousMonth = new Date(this.month);

    previousMonth.setMonth(
      previousMonth.getMonth() - 1
    );

    this.month = previousMonth;
    this.pageIndex = 0;
  }

  handleMonthRight(): void {
    const nextMonth = new Date(this.month);

    nextMonth.setMonth(
      nextMonth.getMonth() + 1
    );

    this.month = nextMonth;
    this.pageIndex = 0;
  }

  handleDateClick(date: Date): void {
    this.selectedDate = new Date(date);

    this.dateSelect.emit(date);
  }

  isSelected(date: Date): boolean {
    return this.isSameDate(
      this.selectedDate,
      date
    );
  }

  isToday(date: Date): boolean {
    return this.isSameDate(
      this.today,
      date
    );
  }

  formatDay(date: Date): string {
    return date
      .getDate()
      .toString()
      .padStart(2, '0');
  }

  formatWeekDay(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  }

  private formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  private startOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  private isBefore(
    date1: Date,
    date2: Date
  ): boolean {
    return (
      this.startOfDay(date1).getTime() <
      this.startOfDay(date2).getTime()
    );
  }

  private isSameDate(
    date1: Date,
    date2: Date
  ): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isSameMonth(
    date1: Date,
    date2: Date
  ): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }
}