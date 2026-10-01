import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './patient-details.html',
})
export class PatientDetails {
  @Input({ required: true }) appointment!: any;
  @Input() loading = false;
}