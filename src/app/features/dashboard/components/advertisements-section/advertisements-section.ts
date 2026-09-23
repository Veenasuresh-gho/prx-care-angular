import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-advertisements-section',
  standalone: true,
  templateUrl: './advertisements-section.html',
})
export class AdvertisementsSection {
  @Input() advertisements: any[] = [];

  currentIndex = 0;

  next(): void {
    if (!this.advertisements.length) return;

    this.currentIndex =
      (this.currentIndex + 1) % this.advertisements.length;
  }

  previous(): void {
    if (!this.advertisements.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this.advertisements.length) %
      this.advertisements.length;
  }

  openAdvertisement(ad: any): void {
    if (ad?.HealthInsightUrl) {
      window.open(ad.HealthInsightUrl, '_blank');
    }
  }
}