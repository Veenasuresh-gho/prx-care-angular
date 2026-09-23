import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface CalendarDay {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
}

@Component({
    selector: 'app-custom-calendar',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
    ],
    templateUrl: './custom-calendar.html',
    styleUrl: './custom-calendar.css',
})
export class CustomCalendarComponent {

    @Input() selectedDate: Date | null = new Date();
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;
    @Output() dateSelected = new EventEmitter<string>();
    isOpen = false;
    currentMonth = new Date();
    calendarDays: CalendarDay[] = [];
    dropdownTop = 0;
    dropdownLeft = 0;


    weekDays = [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
    ];


    constructor(
        private elementRef: ElementRef
    ) { }


    ngOnInit(): void {

        if (this.selectedDate) {

            this.currentMonth = new Date(
                this.selectedDate.getFullYear(),
                this.selectedDate.getMonth(),
                1
            );

        }

        this.generateCalendar();
    }

    get displayDate(): string {

        if (!this.selectedDate) {
            return 'Select date';
        }

        return this.selectedDate.toLocaleDateString(
            'en-US',
            {
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            }
        );
    }

    get monthYear(): string {

        return this.currentMonth.toLocaleDateString(
            'en-US',
            {
                month: 'long',
                year: 'numeric',
            }
        );
    }

    toggleCalendar(): void {

        this.isOpen = !this.isOpen;

        if (!this.isOpen) {
            return;
        }
        if (this.selectedDate) {

            this.currentMonth = new Date(
                this.selectedDate.getFullYear(),
                this.selectedDate.getMonth(),
                1
            );

        }


        this.generateCalendar();
        setTimeout(() => {
            this.setDropdownPosition();
        });
    }

    private setDropdownPosition(): void {

        const button =
            this.elementRef.nativeElement.querySelector(
                '.date-picker-button'
            );

        if (!button) {
            return;
        }


        const rect =
            button.getBoundingClientRect();


        this.dropdownTop =
            rect.bottom + 8;

        this.dropdownLeft =
            rect.left;
        const dropdownWidth = 320;

        const rightEdge =
            this.dropdownLeft + dropdownWidth;

        if (
            rightEdge >
            window.innerWidth - 10
        ) {

            this.dropdownLeft =
                window.innerWidth -
                dropdownWidth -
                10;
        }
        if (this.dropdownLeft < 10) {
            this.dropdownLeft = 10;
        }
    }

    @HostListener('window:resize')
    onWindowResize(): void {

        if (this.isOpen) {
            this.setDropdownPosition();
        }
    }

    @HostListener('window:scroll')
    onWindowScroll(): void {

        if (this.isOpen) {
            this.setDropdownPosition();
        }
    }

    previousMonth(): void {

        this.currentMonth = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() - 1,
            1
        );

        this.generateCalendar();
    }

    nextMonth(): void {

        this.currentMonth = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() + 1,
            1
        );

        this.generateCalendar();
    }

    selectDate(day: CalendarDay): void {

        if (
            !day.isCurrentMonth ||
            day.isDisabled
        ) {
            return;
        }


        this.selectedDate =
            new Date(day.date);
        const formattedDate =
            this.formatDate(
                this.selectedDate
            );


        this.dateSelected.emit(
            formattedDate
        );

        this.isOpen = false;


        this.generateCalendar();
    }

    private formatDate(
        date: Date
    ): string {

        const day =
            String(
                date.getDate()
            ).padStart(2, '0');


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0');


        const year =
            date.getFullYear();


        return `${day}/${month}/${year}`;
    }

    private generateCalendar(): void {

        const year =
            this.currentMonth.getFullYear();

        const month =
            this.currentMonth.getMonth();


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const firstDayIndex =
            firstDay.getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        const previousMonthDays =
            new Date(
                year,
                month,
                0
            ).getDate();


        const days: CalendarDay[] = [];
        for (
            let i = firstDayIndex - 1;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    year,
                    month - 1,
                    previousMonthDays - i
                );


            days.push(
                this.createDay(
                    date,
                    false
                )
            );
        }

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );


            days.push(
                this.createDay(
                    date,
                    true
                )
            );
        }

        let nextDay = 1;

        while (days.length < 42) {

            const date =
                new Date(
                    year,
                    month + 1,
                    nextDay++
                );


            days.push(
                this.createDay(
                    date,
                    false
                )
            );
        }


        this.calendarDays = days;
    }
    private createDay(
        date: Date,
        isCurrentMonth: boolean
    ): CalendarDay {

        return {

            date,

            day:
                date.getDate(),

            isCurrentMonth,

            isToday:
                this.isSameDate(
                    date,
                    new Date()
                ),

            isSelected:
                this.isSameDate(
                    date,
                    this.selectedDate
                ),

            isDisabled:
                this.isDateDisabled(
                    date
                ),
        };
    }

    private isSameDate(
        first: Date,
        second: Date | null
    ): boolean {

        if (!second) {
            return false;
        }


        return (

            first.getFullYear() ===
            second.getFullYear()

            &&

            first.getMonth() ===
            second.getMonth()

            &&

            first.getDate() ===
            second.getDate()
        );
    }

    private isDateDisabled(
        date: Date
    ): boolean {

        if (
            this.minDate &&
            this.isBeforeDate(
                date,
                this.minDate
            )
        ) {
            return true;
        }


        if (
            this.maxDate &&
            this.isAfterDate(
                date,
                this.maxDate
            )
        ) {
            return true;
        }


        return false;
    }

    private isBeforeDate(
        first: Date,
        second: Date
    ): boolean {

        const firstDate =
            new Date(
                first.getFullYear(),
                first.getMonth(),
                first.getDate()
            );


        const secondDate =
            new Date(
                second.getFullYear(),
                second.getMonth(),
                second.getDate()
            );


        return firstDate < secondDate;
    }

    private isAfterDate(
        first: Date,
        second: Date
    ): boolean {

        const firstDate =
            new Date(
                first.getFullYear(),
                first.getMonth(),
                first.getDate()
            );


        const secondDate =
            new Date(
                second.getFullYear(),
                second.getMonth(),
                second.getDate()
            );


        return firstDate > secondDate;
    }

    @HostListener(
        'document:click',
        ['$event']
    )
    onDocumentClick(
        event: MouseEvent
    ): void {

        const target =
            event.target as Node;


        if (
            this.isOpen &&
            !this.elementRef.nativeElement.contains(
                target
            )
        ) {

            this.isOpen = false;
        }
    }
}