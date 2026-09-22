import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../features/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { SideComponent } from '../../features/dashboard/side-component/side-component';
import { GHOService } from '../../services/gho.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    Navbar,
    RouterOutlet,
    SideComponent
  ],
  templateUrl: './dashboard-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout implements OnInit {

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  appointmentDetails: any = null;

  patientId: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');

    this.getDashboardData();
  }

  getDashboardData(): void {

    const tv = [
      {
        T: 'c1',
        V: this.patientId ?? ''
      },
      {
        T: 'c2',
        V: 'dash'
      },
      {
        T: 'c10',
        V: '10'
      }
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.appointmentDetails = res.Data?.[1]?.[0] ? { ...res.Data[1][0] } : null;
        } else {
          this.appointmentDetails = null;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Dashboard API error:', error);
        this.appointmentDetails = null;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}