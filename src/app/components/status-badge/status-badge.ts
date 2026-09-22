import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  @Input() status = '';

  get statusClass(): string {
    switch (this.status?.trim()?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-light text-green';

      case 'cancelled':
      case 'canceled':
      case 'rejected':
        return 'bg-red-light text-red';

      case 'pending':
        return 'bg-yellow-light text-yellow';

      case 'assigned':
      case 'in progress':
        return 'bg-primary-light text-primary';

      case 'completed':
        return 'bg-green-light text-green';

      default:
        return 'bg-light-grey text-grey';
    }
  }
}