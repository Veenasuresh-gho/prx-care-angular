
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralPhysicianDialog } from '../../../../features/dashboard/side-component/home-care-section/components/general-physician-dialog/general-physician-dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general-physician-card',
  standalone: true,
  imports: [GeneralPhysicianDialog, MatIconModule],
  templateUrl: './general-physician-card.html',
})
export class GeneralPhysicianCard {
  @Input() generalPhysician: any[] = [];
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