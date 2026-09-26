import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Navbar } from '../../features/navbar/navbar';
import { RouterOutlet, Router } from '@angular/router';
import { SideComponent } from '../../features/dashboard/side-component/side-component';
import { GHOService } from '../../services/gho.service';
import { WelcomeCard } from '../../features/dashboard/components/welcome-card/welcome-card';
import { Footer } from '../../features/footer/footer';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    Navbar,
    RouterOutlet,
    SideComponent,
    WelcomeCard,
    Footer
  ],
  templateUrl: './dashboard-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout implements OnInit {

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);
  constructor(private router: Router) { }

  appointmentDetails: any = null;
  patientDetails: any = null;
  advertisements: any[] = [];

  patientId: string | null = null;
  isLoading = true;

  get isDashboard(): boolean {
    return this.router.url === '/dashboard';
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
    this.getDashboardData();
    this.getPatientDetails()
  }

  getPatientDetails(): void {
    const tv = [
      {
        T: 'dk1',
        V: this.patientId ?? ''
      },
      {
        T: 'c10',
        V: '3'
      }
    ];

    this.srv.getdata('patient', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.patientDetails=res.Data[0][0];
          console.log(this.patientDetails)
        } else {

        }

      },
      error: (error) => {

      }
    });
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
          this.advertisements = res.Data?.[3] ?? [];
        } else {
          this.appointmentDetails = null;
          this.advertisements = [];
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.appointmentDetails = null;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}