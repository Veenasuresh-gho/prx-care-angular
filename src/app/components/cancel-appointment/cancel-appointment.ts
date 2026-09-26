import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Dialog } from '../dialog/dialog';
import { Button } from '../button/button';
import { GHOService } from '../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancel-appointment',
  standalone: true,
  imports: [Dialog, MatIconModule, Button],
  templateUrl: './cancel-appointment.html',
})
export class CancelAppointment {
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  @Input() open = false;
  @Input() appointmentId?: string;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  selectedReason = signal('');
  customReason = signal('');
  notes = signal('');
  isLoading = signal(false);

  readonly cancelReasons = [
    'Doctor not available',
    'Found an earlier appointment',
    'Emergency came up',
    'Changed my mind',
    'Double Booking',
    'Reschedule needed',
    'Other',
  ];

  get isConfirmDisabled(): boolean {
    return (
      this.isLoading() ||
      !this.selectedReason() ||
      (this.selectedReason() === 'Other' && !this.customReason().trim())
    );
  }

  selectReason(reason: string): void {
    this.selectedReason.set(
      this.selectedReason() === reason ? '' : reason
    );

    if (reason !== 'Other') {
      this.customReason.set('');
    }
  }

  onCustomReasonChange(event: Event): void {
    this.customReason.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  onNotesChange(event: Event): void {
    this.notes.set(
      (event.target as HTMLTextAreaElement).value
    );
  }

  close(): void {
    if (!this.isLoading()) {
      this.openChange.emit(false);
    }
  }

  handleConfirm(): void {
    if (this.isConfirmDisabled) return;

    const reason =
      this.selectedReason() === 'Other'
        ? this.customReason().trim()
        : this.selectedReason();

    this.isLoading.set(true);

    this.srv.getdata('care', [
      { T: 'dk1', V: this.appointmentId ?? '' },
      { T: 'c1', V: reason },
      { T: 'c2', V: this.notes().trim() },
      { T: 'c10', V: '8' },
    ]).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);

        if (response?.Status === 1) {
          this.toastr.success(response?.Data[0][0]?.msg)
          this.openChange.emit(false);
          this.reset();
          this.refetch.emit();
        } else {
          this.toastr.error(response?.Info)
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  private reset(): void {
    this.selectedReason.set('');
    this.customReason.set('');
    this.notes.set('');
  }
}

