import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-slot-button',
  imports: [],
  templateUrl: './time-slot-button.html',
})
export class TimeSlotButton {
  @Input() variant: 'available' | 'unavailable' | 'selected' =
    'available';
}