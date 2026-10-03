import { Component } from '@angular/core';

@Component({
  selector: 'app-download-section',
  imports: [],
  templateUrl: './app-download-section.html',
})
export class AppDownloadSection {
  appStoreUrl = 'https://apps.apple.com/in/app/prx-care/id6739527531';

  playStoreUrl = 'https://play.google.com/store/apps/details?id=prx.care.patient_journey';
}
