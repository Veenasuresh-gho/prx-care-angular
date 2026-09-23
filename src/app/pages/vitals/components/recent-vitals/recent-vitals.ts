import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VitalCardComponent } from '../vital-card/vital-card';
import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../models/gho-model';

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
export class RecentVitalsComponent implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  recentVitals: any[] = [];
  constructor(private cdr: ChangeDetectorRef) { }

  formatDate(date: string | null | undefined): string {
    if (!date) {
      return '';
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  ngOnInit(): void {
    this.getRecentVitals();
  }

  getRecentVitals(): void {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    this.loading = true;
    const tv: tags[] = [
      {
        T: 'dk2',
        V: userId
      },
      {
        T: 'c1',
        V: ''
      },
      {
        T: 'c10',
        V: '6'
      }
    ];

    this.srv.getdata('patientvital', tv).subscribe({
      next: (r) => {
        this.recentVitals = r.Data?.[0] ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Medication API Error:', err);
        this.recentVitals = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onEdit(): void {

  }

}