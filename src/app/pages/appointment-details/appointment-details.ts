import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AppointmentDetailsCard } from './components/appointment-details-card/appointment-details-card';
import { GHOService } from '../../services/gho.service';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-details',
  imports: [AppointmentDetailsCard, JsonPipe, MatIconModule],
  templateUrl: './appointment-details.html',
})
export class AppointmentDetails implements OnInit {
  patientId: string | null = null;
  appontmentList: any[] = [];

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
    this.getAppointmentList();
  }

  getAppointmentList(): void {
    const tv = [
      {
        T: 'dk1',
        V: this.patientId ?? '',
      },
      {
        T: 'c10',
        V: '6',
      }
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.appontmentList = res.Data[0] || [];
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      },
    });
  }
}
