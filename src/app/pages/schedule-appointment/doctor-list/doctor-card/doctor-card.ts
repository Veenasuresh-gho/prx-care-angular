import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-doctor-card',
  imports: [MatIconModule],
  templateUrl: './doctor-card.html',
})
export class DoctorCard {
  @Input() doctor:any;

  @Output() viewTimings = new EventEmitter<string>();

  handleViewTimings(): void {
    console.log(this.doctor)
    if (this.doctor?.Alt) {
      this.viewTimings.emit(this.doctor.Alt);
    }
  }
}