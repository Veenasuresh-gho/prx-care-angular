import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-card',
  imports: [MatIconModule],
  templateUrl: './doctor-card.html',
})
export class DoctorCard {
  @Input() doctor: any;
  private router = inject(Router);
  @Output() viewTimings = new EventEmitter<string>();

  handleViewTimings(): void {
    if (this.doctor?.Alt) {
      this.router.navigate(['/schedule-appointment', this.doctor.Alt]);
    }
  }
}