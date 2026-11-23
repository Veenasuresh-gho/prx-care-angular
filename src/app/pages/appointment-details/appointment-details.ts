import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AppointmentDetailsCard } from './components/appointment-details-card/appointment-details-card';
import { GHOService } from '../../services/gho.service';
import { JsonPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [AppointmentDetailsCard, JsonPipe, MatIconModule,MatProgressSpinnerModule],
  templateUrl: './appointment-details.html',
})
export class AppointmentDetails implements OnInit {
  patientId: string | null = null;
  appontmentList: any[] = [];
  isLoading = false;

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
    this.getAppointmentList();
  }

  getAppointmentList(): void {
    this.isLoading = true;

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

    this.srv.getdata('care', tv)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          if (res.Status === 1) {
            this.appontmentList = res.Data[0] || [];
          }
        },
        error: (error) => {
          console.error('Error fetching appointments:', error);
        },
      });
  }
}