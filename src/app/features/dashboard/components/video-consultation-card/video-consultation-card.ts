import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-video-consultation-card',
  standalone: true,
  imports: [MatIconModule, Button],
  templateUrl: './video-consultation-card.html',
})
export class VideoConsultationCard {
  private router = inject(Router);

  handleBook(): void {
    this.router.navigateByUrl('/en/schedule-appointment?type=tele');
  }
}