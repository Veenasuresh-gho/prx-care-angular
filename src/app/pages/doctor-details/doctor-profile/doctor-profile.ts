import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DoctorDetailsModal } from '../doctor-details-modal/doctor-details-modal';

@Component({
  selector: 'app-doctor-profile',
  imports: [MatIconModule, DoctorDetailsModal],
  templateUrl: './doctor-profile.html',
})
export class DoctorProfile {
  @Input() doctor: any = null;
  @Input() education: any[] = [];
  @Input() experience: any[] = [];
  showDetails = false;
}