import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppointmentCard } from './components/appointment-card/appointment-card';
import { GHOService } from '../../../services/gho.service';
import { PatientDetails } from './components/patient-details/patient-details';
import { PaymentAlert } from './components/payment-alert/payment-alert';
import { CheckinOrPaymentProceed } from './components/checkin-or-payment-proceed/checkin-or-payment-proceed';
import { AppointmentFlow } from './components/appointment-flow/appointment-flow';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    AppointmentCard,
    PatientDetails,
    PaymentAlert,
    CheckinOrPaymentProceed,
    AppointmentFlow,
  ],
  templateUrl: './details-page.html',
})
export class DetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly srv = inject(GHOService);
  private readonly cdr = inject(ChangeDetectorRef);

  appointmentId = '';
  patientId: string | null = null;

  appointmentDetails: any = null;
  appointmentTrack: any[] = [];

  ngOnInit(): void {
    this.appointmentId =
      this.route.snapshot.paramMap.get('id') ?? '';

    this.patientId = sessionStorage.getItem('id');

    this.refetch();
  }

  get appointmentStatus(): string {
    return (
      this.appointmentDetails?.AppStatus ??
      this.appointmentDetails?.appointmentStatus ??
      ''
    ).toLowerCase();
  }

  get isCancelled(): boolean {
    return this.appointmentStatus === 'cancelled';
  }

  get isConfirmed(): boolean {
    return this.appointmentStatus === 'confirmed';
  }

  getAppointmentDetails(): void {
    const tv = [
      { T: 'dk1', V: this.appointmentId },
      { T: 'c10', V: '7' },
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.appointmentDetails = res.Data?.[0]?.[0] ?? null;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching appointment details:', error);
      },
    });
  }

  getAppointmentTracker(): void {
    const tv = [
      { T: 'dk1', V: this.appointmentId },
      { T: 'dk2', V: this.patientId ?? '' },
      { T: 'c10', V: '1' },
    ];

    this.srv.getdata('appointmenttrack', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.appointmentTrack = res.Data?.[0] ?? [];
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching appointment tracker:', error);
      },
    });
  }

  refetch(): void {
    this.getAppointmentDetails();
    this.getAppointmentTracker();
  }
}