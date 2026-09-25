import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CustomInput } from '../../../../../../components/input/input';
import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';

@Component({
  selector: 'app-general-physician-dialog',
  standalone: true,
  imports: [
    FormsModule,
    CustomInput,
    Dialog,
    Button
  ],
  templateUrl: './general-physician-dialog.html',
})
export class GeneralPhysicianDialog {
  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();

  date = '';
  time = '';
  name = '';
  phone = '';
  address = '';

  get isViewMode(): boolean {
    return !!this.booking;
  }

  close(): void {
    this.openChange.emit(false);
  }

  confirmBooking(): void {
    console.log({
      date: this.date,
      time: this.time,
      name: this.name,
      phone: this.phone,
      address: this.address,
    });
  }

  cancelBooking(): void {
    console.log('Cancel booking');
  }

  openLocation(): void {
    console.log('Open location picker');
  }
}