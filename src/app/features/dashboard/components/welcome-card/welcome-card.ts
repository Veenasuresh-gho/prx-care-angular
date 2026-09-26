import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  templateUrl: './welcome-card.html'
})
export class WelcomeCard {

  @Input() patientDetails: any = null;

}