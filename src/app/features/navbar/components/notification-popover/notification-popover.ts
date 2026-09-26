import { Component, inject, OnInit, signal } from '@angular/core';
import { GHOService } from '../../../../services/gho.service';
import { MatIconModule } from '@angular/material/icon';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notification-popover',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './notification-popover.html',
})
export class NotificationPopover implements OnInit {
  private srv = inject(GHOService);

  isOpen = signal(false);
  loading = signal(false);

  patientId: string | null = null;

  notifications = signal<Notification[]>([]);

  get hasUnreadNotifications(): boolean {
    return this.notifications().some(
      notification => !notification.isRead
    );
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');

    this.getNotifications();
  }

  getNotifications(): void {
    this.loading.set(true);

    const tv = [
      {
        T: 'dk1',
        V: this.patientId ?? '',
      },
      {
        T: 'c10',
        V: '2',
      },
    ];

    this.srv.getdata('notification', tv).subscribe({
      next: (res) => {
        if (res.Status === 1 && Array.isArray(res.Data?.[0])) {
          const notificationList: Notification[] = res.Data[0].map(
            (item: any) => ({
              id: item.ID,
              title: item.Title,
              message: item.Message,
              date: item.CreatedAt,
              isRead: false,
            })
          );

          this.notifications.set(notificationList);
        } else {
          this.notifications.set([]);
        }

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load notifications:', error);

        this.notifications.set([]);
        this.loading.set(false);
      },
    });
  }

  togglePopover(): void {
    this.isOpen.update(value => !value);
  }

  closePopover(): void {
    this.isOpen.set(false);
  }

  getTimeAgo(date: string): string {
    const notificationDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - notificationDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'just now';
    }

    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}