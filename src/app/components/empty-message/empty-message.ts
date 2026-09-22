import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-message',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './empty-message.html',
  styleUrl: './empty-message.css'
})
export class EmptyMessageComponent {

  @Input() message = 'No data available';

  @Input() showButton = false;

  @Input() buttonText = 'Add';

  @Input() buttonIcon = 'add';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}