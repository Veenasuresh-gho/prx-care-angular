import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VitalCardComponent } from '../vital-card/vital-card';
import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../models/gho-model';
import { CustomCalendarComponent } from '../../../../components/custom-calendar/custom-calendar';

@Component({
  selector: 'app-vitals-history',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VitalCardComponent,
    CustomCalendarComponent
  ],
  templateUrl: './vitals-history.html',
  styleUrl: './vitals-history.css',
})
export class VitalsHistoryComponent {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  vitalsHistory: any[] = [];
  selectedDate: Date = new Date();
  selectedDateText: string = '';
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectedDateText = this.formatApiDate(this.selectedDate);
    this.getVitalsHistory();
  }


formatApiDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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

  onDateSelected(date: string): void {
    this.selectedDateText = date;
    this.getVitalsHistory();
  }

  getVitalsHistory(): void {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    this.loading = true;
    const tv: tags[] = [
       {
        T: 'dk1',
        V: ''
      },
      {
        T: 'dk2',
        V: userId
      },
      {
        T: 'c1',
        V: this.selectedDateText
      },
      {
        T: 'c10',
        V: '6'
      }
    ];
    this.srv.getdata('patientvital', tv).subscribe({
      next: (r) => {
        this.vitalsHistory = r.Data?.[0] ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Vitals API Error:', err);
        this.vitalsHistory = [];
        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }
}