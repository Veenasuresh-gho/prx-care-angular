
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EditAddressDialog } from '../edit-address-dialog/edit-address-dialog';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    EditAddressDialog,
  ],
  templateUrl: './address.html',
})
export class Address {
  @Input() patientDetails: any = null;
  @Input() loading = false;

  @Output() refetch = new EventEmitter<void>();

  isEditDialogOpen = false;

  get addressDetails() {
    const p = this.patientDetails;

    return [
      {
        label: 'City',
        value: p?.City || p?.city,
      },
      {
        label: 'State',
        value: p?.State || p?.state,
      },
      {
        label: 'Country',
        value: p?.CountryName || p?.countryName,
      },
      {
        label: 'Postal Code',
        value: p?.PostalCode || p?.postalCode,
      },
    ];
  }

  openEditDialog(): void {
    this.isEditDialogOpen = true;
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
  }

  handleRefetch(): void {
    this.isEditDialogOpen = false;
    this.refetch.emit();
  }
}

