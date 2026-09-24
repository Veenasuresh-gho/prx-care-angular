import { Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { ServicesSection } from './components/services-section/services-section';
import { AmbulanceCard } from './components/ambulance-card/ambulance-card';
import { VideoConsultationCard } from './components/video-consultation-card/video-consultation-card';
import { AdvertisementsSection } from './components/advertisements-section/advertisements-section';
import { AppDownloadSection } from './components/app-download-section/app-download-section';

@Component({
  selector: 'app-dashboard',
  imports: [ServicesSection, AmbulanceCard, VideoConsultationCard, AdvertisementsSection,AppDownloadSection],
  standalone: true,
  templateUrl: './dashboard.html'
})
export class Dashboard {

  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{
    patientDetails: any;
    advertisements: any[];
  }>;
}