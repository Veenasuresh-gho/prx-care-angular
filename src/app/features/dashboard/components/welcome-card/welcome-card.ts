import { Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-welcome-card',
  imports: [JsonPipe],
  standalone: true,
  templateUrl: './welcome-card.html'
})
export class WelcomeCard {

  @Input() patientDetails: any = null;

}