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
        T: 'c8',
        V: '21',
      },
      {
        T: 'c10',
        V: '2',
      },
    ];

    this.srv.getdata('hcare_', tv).subscribe({
      next: (res) => {
        if (res?.Status === 1) {
          const bookings = res?.Data?.[0] ?? [];

          this.generalPhysician = bookings.filter(
            (item: any) =>
              item.Type?.toLowerCase() === 'general physician'
          );

          this.pharmacyDelivery = bookings.filter(
            (item: any) =>
              item.Type?.toLowerCase() === 'pharmacy delivery'
          );

          this.nursingServices = bookings.filter(
            (item: any) =>
              item.Type?.toLowerCase() === 'nursing services'
          );

          this.labCollection = bookings.filter(
            (item: any) =>
              item.Type?.toLowerCase() === 'lab collection'
          );
        } else {
          this.clearBookings();
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Bookings API error:', error);

        this.clearBookings();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private clearBookings(): void {
    this.generalPhysician = [];
    this.pharmacyDelivery = [];
    this.nursingServices = [];
    this.labCollection = [];
  }

  refetchBookings(): void {
    this.getBookings();
  }
}