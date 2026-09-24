import { Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-doctor-details-modal',
  imports: [JsonPipe],
  templateUrl: './doctor-details-modal.html',
})
export class DoctorDetailsModal {

  @Input() experience: any[] = [];
  @Input() education: any[] = [];
  @Input() accreditations = '';

}