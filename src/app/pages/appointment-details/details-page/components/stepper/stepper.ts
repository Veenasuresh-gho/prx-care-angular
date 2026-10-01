import {
  Component,
  Input,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-stepper-timeline',
  standalone: true,
  imports: [MatIconModule,JsonPipe],
  templateUrl: './stepper.html',
})
export class StepperTimeline {
  @Input() steps: any[] = [];
  @Input() loading = false;
  @Input() className = '';

  get currentIndex(): number {
    return this.steps.findIndex(
      (step) => step.Status !== 1
    );
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return dateStr;
    }

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}