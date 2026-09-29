import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface AbdmLogo {
  name: string;
  src: string;
  href?: string;
}

@Component({
  selector: 'app-abdm',
  standalone: true,
  imports: [MatIconModule,RouterModule],
  templateUrl: './abdm.html',
})
export class Abdm {
  readonly logos: AbdmLogo[] = [
    {
      name: 'MOHFW',
      src: '/abdm/mohfw-logo.svg',
    },
    {
      name: 'Digital India',
      src: '/abdm/digital-india-logo.svg',
    },
    {
      name: 'MOHFW',
      src: '/abdm/mohfw-logo.svg',
    },
    {
      name: 'ABDM',
      src: '/abdm/abdm-logo.svg',
      href: 'https://abdm.gov.in/',
    },
  ];

  readonly abhaImage = '/abdm/abha-card.png';

  readonly phrImage = '/abdm/phr-app.png';
}