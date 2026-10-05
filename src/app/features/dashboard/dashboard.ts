import { Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { ServicesSection } from './components/services-section/services-section';
import { AmbulanceCard } from './components/ambulance-card/ambulance-card';
import { VideoConsultationCard } from './components/video-consultation-card/video-consultation-card';
import { AdvertisementsSection } from './components/advertisements-section/advertisements-section';
import { AppDownloadSection } from './components/app-download-section/app-download-section';
import { HealthDataPrivacyRegulationsComponent } from './components/health-data-privacy-regulations/health-data-privacy-regulations';
import { FeaturedServicesComponent } from './components/featured-services/featured-services';
import { AbdmCompliantSectionComponent } from './components/abdm-complaint-section/abdm-complaint-section';
import { FaqSectionComponent } from './components/faq-section/faq-section';
import { HealthWellnessCareComponent } from './components/health-wellness-care-section/health-wellness-care';

@Component({
  selector: 'app-dashboard',
  imports: [ServicesSection,
      AmbulanceCard,
      VideoConsultationCard,
      AdvertisementsSection,
      AppDownloadSection,
      HealthDataPrivacyRegulationsComponent,
      FeaturedServicesComponent,
      AbdmCompliantSectionComponent,
      FaqSectionComponent,
      HealthWellnessCareComponent],
  standalone: true,
  templateUrl: './dashboard.html'
})
export class Dashboard {

  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{
    patientDetails: any;
    advertisements: any[];
  }>;
}