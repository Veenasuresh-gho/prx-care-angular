import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VitalCardComponent } from '../vital-card/vital-card';

@Component({
  selector: 'app-recent-vitals',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VitalCardComponent,
  ],
  templateUrl: './recent-vitals.html',
  styleUrl: './recent-vitals.css',
})
export class RecentVitalsComponent {




  onEdit(): void {
   
  }

}