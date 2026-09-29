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
    icon: 'business',
    link: 'https://www.linkedin.com/company/prx-care',
    label: 'LinkedIn',
  },
  {
    icon: 'facebook',
    link: 'https://www.facebook.com/people/PRxcare/61560169178371/',
    label: 'Facebook',
  },
  {
    icon: 'photo_camera',
    link: 'https://www.instagram.com/prx.care?stkn=MW9zZGk3ODVwcnhnNg==',
    label: 'Instagram',
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
        { label: 'Careers', link: '/careers' },
      ],
    },
    {
      title: 'Services',
      links: [{ label: 'Book Appointment', link: '/schedule-appointment' }],
    },
    {
      title: 'Ayushman Bharath Digital Mission (ABDM)',
      links: [
        { label: 'View All ABDM Services', link: '/ayushman-bharath-digital-mission' },
        {
          label: 'ABDM Website',
          link: 'https://abdm.gov.in/',
          external: true,
        },
      ],

    },
  ];

  readonly storeBadges: StoreBadge[] = [
    {
      qr: '/qr-code/play-store.svg',
      button: 'assets/playstore.svg',
      link: 'https://play.google.com/store/apps/details?id=prx.care.patient_journey',
      label: 'Play Store',
    },
    {
      qr: '/qr-code/app-store.svg',
      button: 'assets/appstore.svg',
      link: 'https://apps.apple.com/in/app/prx-care/id6739527531',
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