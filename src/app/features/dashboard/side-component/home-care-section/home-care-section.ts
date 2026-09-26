import { Component, inject, OnInit } from '@angular/core';
import { Button } from '../../../../components/button/button';
import { NgClass } from '@angular/common';
import { GeneralPhysicianDialog } from './components/general-physician-dialog/general-physician-dialog';
import { PharmacyDeliveryDialog } from './components/pharmacy-delivery/pharmacy-delivery';
import { NursingServicesDialog } from './components/nursing-services/nursing-services';
import { LabCollectionDialog } from './components/lab-collection-dialog/lab-collection-dialog';
import { GHOService } from '../../../../services/gho.service';

@Component({
  selector: 'app-home-care-section',
  imports: [Button, NgClass, GeneralPhysicianDialog, PharmacyDeliveryDialog, NursingServicesDialog, LabCollectionDialog],
  templateUrl: './home-care-section.html',
})
export class HomeCareSection implements OnInit {
  countryList: any[] = [];

  srv = inject(GHOService);

  showGeneralDialog = false;
  showPharmacyDialog = false;
  showNursingDialog = false;
  showLabDialog = false;

  homeCare = [
    {
      heading: 'General Physician',
      subHeading: 'Book Home Service',
      image: 'assets/general-physician.png',
      border: 'border-[#A18AD4]',
      bg: 'bg-[#E3D9FF]',
      onClick: () => this.openGeneralDialog(),
    },
    {
      heading: 'Pharmacy Delivery',
      subHeading: 'Medicines at your door',
      image: 'assets/pharmacy-delivery.png',
      border: 'border-[#7FB9B7]',
      bg: 'bg-[#D5F2F1]',
      onClick: () => this.openPharmacyDialog(),
    },
    {
      heading: 'Nursing Services',
      subHeading: 'Support by your side',
      image: 'assets/nurses.png',
      border: 'border-[#7E96E0]',
      bg: 'bg-[#D6E2FF]',
      onClick: () => this.openNurseDialog(),
    },
    {
      heading: 'Lab Collection',
      subHeading: 'Health checks from home',
      image: 'assets/lab_collection.png',
      border: 'border-[#D184A8]',
      bg: 'bg-[#FFD6EA]',
      onClick: () => this.openLabDialog(),
    },
  ];

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList() {
    const tv = [
      { T: 'c10', V: '99' }
    ];
    this.srv.getdata('lists', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.countryList = res.Data;
          console.log(this.countryList)
        }
      },
    });
  }

  openGeneralDialog(): void {
    this.showGeneralDialog = true;
  }

  openPharmacyDialog(): void {
    this.showPharmacyDialog = true;

  }

  openNurseDialog(): void {
    this.showNursingDialog = true;
  }

  openLabDialog(): void {
    this.showLabDialog = true;
  }

  handleShowBookings(): void {
    // navigate/open bookings
  }
}
