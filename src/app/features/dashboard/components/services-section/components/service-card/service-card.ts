import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardServiceItem } from '../../../../../../services/service-items';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [],
  templateUrl: './service-card.html',
})
export class ServiceCard {
  private router = inject(Router);

  @Input() service!: DashboardServiceItem;

  navigate(): void {
    this.router.navigateByUrl(this.service.link);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigate();
    }
  }
}