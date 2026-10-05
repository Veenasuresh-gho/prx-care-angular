import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-talk-to-wellness-expert',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './talk-to-wellness-expert.html'
})
export class TalkToWellnessExpert {

  constructor(private router: Router) {}
  startConsultation(): void {
    this.router.navigate(
      ['/schedule-appointment'],
      {
        queryParams: {
          id: 2
        }
      }
    );
  }
}