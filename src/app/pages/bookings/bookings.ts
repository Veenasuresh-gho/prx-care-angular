import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { GHOService } from '../../services/gho.service';

import { NursingServicesCard } from './components/nursing-services-card/nursing-services-card';
import { LabCollectionCard } from './components/lab-collection-card/lab-collection-card';
import { GeneralPhysicianCard } from './components/general-physician-card/general-physician-card';
import { PharmacyDeliveryCard } from './components/pharmacy-delivery-card/pharmacy-delivery-card';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    GeneralPhysicianCard,
    PharmacyDeliveryCard,
    NursingServicesCard,
    LabCollectionCard,
  ],
  templateUrl: './bookings.html',
})
export class Bookings implements OnInit {
  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  patientId: string | null = null;

  generalPhysician: any[] = [];
  pharmacyDelivery: any[] = [];
  nursingServices: any[] = [];
  labCollection: any[] = [];

  isLoading = false;

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');

    this.getBookings();
  }

  getBookings(): void {
    if (!this.patientId) {
      return;
    }

    this.isLoading = true;

    const tv = [
      {
        T: 'dk1',
        V: this.patientId,
      },
      {
        T: 'c10',
        V: '2',
      },
    ];

    this.srv.getdata('homecare', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          const data = res?.Data ?? [];

          this.generalPhysician = data[0] ?? [];
          this.pharmacyDelivery = data[1] ?? [];
          this.nursingServices = data[2] ?? [];
          this.labCollection = data[3] ?? [];
        } else {
          this.generalPhysician = [];
          this.pharmacyDelivery = [];
          this.nursingServices = [];
          this.labCollection = [];
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
  }

  refetchBookings(): void {
    this.getBookings();
  }
}