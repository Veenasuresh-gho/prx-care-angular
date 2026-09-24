import { Component, inject, Input, signal, computed, OnInit } from '@angular/core';
import { WeekDayPicker } from '../../../components/week-day-picker/week-day-picker';
import { TimeSlotButton } from '../../../components/time-slot-button/time-slot-button';
import { GHOService } from '../../../services/gho.service';
import { formatDateToMMDDYYYYFromDate } from '../../../utils/date';
import { Button } from '../../../components/button/button';

@Component({
  selector: 'app-slot-picker',
  standalone: true,
  imports: [WeekDayPicker, TimeSlotButton, Button],
  templateUrl: './slot-picker.html',
})
export class SlotPicker implements OnInit {
  @Input() doctorId: string | null = null;

  slots = signal<any[]>([]);
  doctorDetails: any;
  isLoading = signal<boolean>(false);

  regularSlots = computed(() =>
    this.slots().filter((s) => s.IsTM === 0)
  );

  onlineConsultationSlots = computed(() =>
    this.slots().filter((s) => s.IsTM === 1)
  );

  private srv = inject(GHOService);

  ngOnInit(): void {
    this.onDateSelect(new Date());
  }

  onDateSelect(date: Date): void {
    if (!this.doctorId) return;

    this.isLoading.set(true);

    const formattedDate = formatDateToMMDDYYYYFromDate(date);

    const tv = [
      { T: 'dk1', V: this.doctorId },
      { T: 'dk2', V: formattedDate },
      { T: 'c10', V: '12' },
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.slots.set(res.Data[0] || []);
          this.doctorDetails = res.Data[1]?.[0] || null;
        } else {
          this.slots.set([]);
          this.doctorDetails = null;
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching slots:', error);

        this.slots.set([]);
        this.doctorDetails = null;
        this.isLoading.set(false);
      },
    });
  }
}