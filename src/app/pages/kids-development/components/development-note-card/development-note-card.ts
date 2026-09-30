import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-development-note-card',
  standalone: true,
  templateUrl: './development-note-card.html',
})
export class DevelopmentNoteCard {
  @Input() title = 'Development';

  @Input()
  message =
    'Milestones can vary from child to child. A single milestone reached slightly early or late is usually not significant.';
}

