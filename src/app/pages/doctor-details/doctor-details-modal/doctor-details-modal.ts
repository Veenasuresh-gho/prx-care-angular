import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doctor-details-modal',
  templateUrl: './doctor-details-modal.html',
})
export class DoctorDetailsModal {

  @Input() experience: any[] = [];
  @Input() education: any[] = [];
  @Input() accreditations = '';

}