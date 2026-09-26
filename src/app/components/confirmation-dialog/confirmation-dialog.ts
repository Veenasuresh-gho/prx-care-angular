import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    Dialog,
    MatIconModule,
  ],
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  @Input() open = false;

  @Input() title = 'Are you sure?';

  @Input() message = 'Are you sure you want to continue?';

  @Input() confirmText = 'Confirm';

  @Input() cancelText = 'Cancel';

  @Input() icon = 'help_outline';

  @Input() danger = false;

  @Output() openChange = new EventEmitter<boolean>();

  @Output() confirmed = new EventEmitter<void>();

  @Output() cancelled = new EventEmitter<void>();

  close(): void {
    this.openChange.emit(false);
    this.cancelled.emit();
  }

  confirm(): void {
    this.confirmed.emit();
    this.openChange.emit(false);
  }
}