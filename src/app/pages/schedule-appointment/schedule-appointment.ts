import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Search } from './search/search';
import { DoctorList } from './doctor-list/doctor-list';
import { GHOService } from '../../services/gho.service';

@Component({
  selector: 'app-schedule-appointment',
  imports: [Search, DoctorList],
  templateUrl: './schedule-appointment.html',
})
export class ScheduleAppointment {

  searchTerm = '';
  searchResults: any[] = [];

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  onSearchChange(value: string): void {
    this.searchTerm = value;

    const tv = [
      {
        T: 'dk1',
        V: this.searchTerm,
      },
      {
        T: 'c10',
        V: '10',
      },
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.searchResults = res.Data[0] || [];

          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      },
    });
  }
}