import {
  Component,
  Input,
} from '@angular/core';

import { StepperTimeline } from '../stepper/stepper';

@Component({
  selector: 'app-appointment-flow',
  standalone: true,
  imports: [StepperTimeline],
  templateUrl: './appointment-flow.html',
})
export class AppointmentFlow {
  @Input() appointmenttrack: any[] = [];
  @Input() loading = false;

  get steps(): any[] {
    return this.appointmenttrack ?? [];
  }
}