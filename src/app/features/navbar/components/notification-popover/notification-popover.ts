import { Component, signal } from '@angular/core';

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
  templateUrl: './notification-popover.html'
})
export class NotificationPopover {

  isOpen = signal(false);

  loading = signal(false);

  notifications = signal<Notification[]>([]);

  get hasUnreadNotifications(): boolean {
    return this.notifications().some(
      notification => !notification.isRead
    );
  }

  togglePopover() {
    this.isOpen.update(value => !value);
  }

  closePopover() {
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