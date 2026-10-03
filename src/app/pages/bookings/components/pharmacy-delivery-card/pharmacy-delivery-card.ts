import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PharmacyDeliveryDialog } from '../../../../features/dashboard/side-component/home-care-section/components/pharmacy-delivery/pharmacy-delivery';

@Component({
  selector: 'app-pharmacy-delivery-card',
  standalone: true,
  imports: [
    MatIconModule,
    PharmacyDeliveryDialog,
  ],
  templateUrl: './pharmacy-delivery-card.html',
})
export class PharmacyDeliveryCard {
  @Input() pharmacyDelivery: any[] = [];
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