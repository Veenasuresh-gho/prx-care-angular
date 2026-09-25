import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.html',
})
export class Dialog {
  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  close(): void {
    this.openChange.emit(false);
  }
}