import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './my-bookings.html',
    styleUrl: './my-bookings.css'
})
export class MyBookings implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    private readonly srv = inject(GHOService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly toastr = inject(ToastrService);

    patientId = '';
    bookings: any[] = [];
    loading = false;
    cancellingBookingId: number | string | null = null;
    error = false;

    ngOnInit(): void {
        this.patientId = sessionStorage.getItem('id') ?? '';
        this.getBookings();
    }

    getBookings(): void {
        if (!this.patientId) {
            return;
        }
        this.loading = true;
        this.error = false;
        this.cdr.markForCheck();
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.patientId
            },
            {
                T: 'c10',
                V: '2'
            }
        ];

        this.srv
            .getdata('ambulance', tv)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.bookings = response?.Data?.[0] ?? [];
                    this.loading = false;
                    this.error = false;
                    this.cdr.markForCheck();
                },
                error: error => {
                    console.error(
                        'Get ambulance bookings error:',
                        error
                    );
                    this.bookings = [];
                    this.loading = false;
                    this.error = true;
                    this.cdr.markForCheck();
                }
            });
    }

    cancelBooking(booking: any): void {
        if (!this.patientId || !booking?.ID) {
            return;
        }
        const bookingId = booking.ID;
        this.cancellingBookingId = bookingId;
        this.cdr.markForCheck();
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.patientId
            },
            {
                T: 'dk2',
                V: String(bookingId)
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv
            .getdata('ambulance', tv)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.cancellingBookingId = null;
                    const bookingIndex =
                        this.bookings.findIndex(
                            item => item?.ID === bookingId
                        );
                    if (bookingIndex !== -1) {
                        this.bookings[bookingIndex] = {
                            ...this.bookings[bookingIndex],
                            Status: 'Cancelled'
                        };
                        this.bookings = [...this.bookings];
                    }
                    this.toastr.success(
                        'Ambulance booking cancelled successfully.'
                    );
                    this.cdr.markForCheck();
                    this.getBookings();
                },
                error: error => {
                    console.error(
                        'Cancel ambulance booking error:',
                        error
                    );
                    this.cancellingBookingId = null;
                    this.toastr.error(
                        'Failed to cancel ambulance booking.'
                    );
                    this.cdr.markForCheck();
                }
            });
    }

    retry(): void {
        this.getBookings();
    }

    isCancelling(booking: any): boolean {
        return this.cancellingBookingId === booking?.ID;
    }

    getStatusClass(status: string | undefined): string {
        switch (status?.toLowerCase()) {
            case 'booked':
                return 'status-booked';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-default';
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}