import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface FooterLink {
  label: string;
  link: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: string;
  link: string;
  label: string;
}

interface StoreBadge {
  qr: string;
  button: string;
  link: string;
  label: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './footer.html',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly lastUpdated = this.getBuildTimestamp();

  readonly logo = 'assets/logo.svg';
  readonly tagline = 'Empowering your healthcare journey with innovative solutions.';

  readonly socialLinks: SocialLink[] = [
    {
      icon: 'linkedin',
      link: 'https://linkedin.com/company/aabind-hospital',
      label: 'LinkedIn',
    },
    {
      icon: 'photo_camera',
      link: 'https://instagram.com/aabindhospital',
      label: 'Instagram',
    },
    {
      icon: 'facebook',
      link: 'https://facebook.com/aabindhospital',
      label: 'Facebook',
    },
    {
      icon: 'play_circle',
      link: 'https://youtube.com/@aabindhospital',
      label: 'Youtube',
    },
  ];

  readonly footerSections: FooterSection[] = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', link: '/about' },
        { label: 'Contact', link: '/contact' },
        { label: 'Privacy Policy', link: '/privacy-policy' },
        { label: 'Shipping Policy', link: '/shipping-policy' },
        { label: 'Cancellation Policy', link: '/cancellation-policy' },
        { label: 'Terms & Conditions', link: '/terms-and-conditions' },
      ],
    },
    {
      title: 'Services',
      links: [{ label: 'Book Appointment', link: '/dashboard/schedule-appointment' }],
    },
  ];

  readonly storeBadges: StoreBadge[] = [
    {
      qr: 'assets/aabind-playstore-qr.png',
      button: 'assets/playstore.svg',
      link: 'https://play.google.com/store/apps/details?id=com.aarogyam.aabind',
      label: 'Play Store',
    },
    {
      qr: 'assets/aabind-appstore-qr.png',
      button: 'assets/appstore.svg',
      link: 'https://apps.apple.com/in/app/aarogyam-by-aabind/id6780435426',
      label: 'App Store',
    },
  ];

  private getBuildTimestamp(): string {
    return new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '');
  }
}