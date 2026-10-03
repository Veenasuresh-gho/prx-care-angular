
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LabCollectionDialog } from '../../../../features/dashboard/side-component/home-care-section/components/lab-collection-dialog/lab-collection-dialog';

@Component({
  selector: 'app-lab-collection-card',
  standalone: true,
  imports: [
    MatIconModule,
    LabCollectionDialog,
  ],
  templateUrl: './lab-collection-card.html',
})
export class LabCollectionCard {
  @Input() labCollection: any[] = [];
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