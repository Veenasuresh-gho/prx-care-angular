import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DoctorProfile } from './doctor-profile/doctor-profile';
import { GHOService } from '../../services/gho.service';
import { ActivatedRoute } from '@angular/router';
import { SlotPicker } from './slot-picker/slot-picker';

@Component({
  selector: 'app-doctor-details',
  imports: [DoctorProfile, SlotPicker],
  templateUrl: './doctor-details.html',
})
export class DoctorDetails implements OnInit {

  doctorDetails: any[] = [];
  education: any[] = [];
  experience: any[] = [];
  accreditation: any[] = [];

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  doctorId: string | null = null;
  
  getDoctorList(doctorId: string): void {
    const tv = [
      {
        T: 'dk1',
        V: doctorId,
      },
      {
        T: 'c10',
        V: '11',
      },
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.doctorDetails = res.Data[0][0] || [];
          this.experience = res.Data[2] || [];
          this.education = res.Data[1] || [];
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching doctor details:', error);
      },
    });
  }
  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    if (this.doctorId) {
      this.getDoctorList(this.doctorId);
    }
  }


}