import { Component } from '@angular/core';
import { Button } from '../../../../components/button/button';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-home-care-section',
  imports: [Button, NgClass],
  templateUrl: './home-care-section.html',
})
export class HomeCareSection {
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

  openGeneralDialog(): void {
    // open general physician dialog
  }

  openPharmacyDialog(): void {
    // open pharmacy dialog
  }

  openNurseDialog(): void {
    // open nursing dialog
  }

  openLabDialog(): void {
    // open lab collection dialog
  }

  handleShowBookings(): void {
    // navigate/open bookings
  }
}
