import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD_SERVICES, DashboardServiceItem } from '../../../../services/service-items';

@Component({
  selector: 'app-services-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './services-dropdown.html',
})
export class ServicesDropdown {
  private router = inject(Router);

  servicesGrouped = DASHBOARD_SERVICES;

  openGroup: string | null = null;

  toggleGroup(groupName: string): void {
    this.openGroup =
      this.openGroup === groupName ? null : groupName;
  }

  navigateTo(service: DashboardServiceItem): void {
    this.openGroup = null;

    this.router.navigateByUrl(service.link);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.services-dropdown')) {
      this.openGroup = null;
    }
  }
}