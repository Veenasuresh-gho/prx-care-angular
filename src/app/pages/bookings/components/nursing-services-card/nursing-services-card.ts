
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NursingServicesDialog } from '../../../../features/dashboard/side-component/home-care-section/components/nursing-services/nursing-services';

@Component({
  selector: 'app-nursing-services-card',
  standalone: true,
  imports: [
    MatIconModule,
    NursingServicesDialog,
  ],
  templateUrl: './nursing-services-card.html',
})
export class NursingServicesCard {
  @Input() nursingServices: any[] = [];
  @Output() refetch = new EventEmitter<void>();

  selectedBooking: any = null;
  openDialog = false;

  handleCardClick(booking: any): void {
    if (booking.status?.toLowerCase() === 'cancelled') {
      return;
    }

    this.selectedBooking = booking;
    this.openDialog = true;
  }

  onDialogChange(open: boolean): void {
    this.openDialog = open;

    if (!open) {
      this.selectedBooking = null;
    }
  }

  onRefetch(): void {
    this.refetch.emit();
  }
}