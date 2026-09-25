import {
  Component,
  inject,
  Input,
  signal,
  computed,
  OnInit,
} from '@angular/core';

import { WeekDayPicker } from '../../../components/week-day-picker/week-day-picker';
import { TimeSlotButton } from '../../../components/time-slot-button/time-slot-button';
import { GHOService } from '../../../services/gho.service';
import { formatDateToMMDDYYYYFromDate } from '../../../utils/date';
import { Button } from '../../../components/button/button';
import { SheetComponent } from '../../../components/sheet/sheet-component';
import { AppointmentPreviewSheet } from '../appointment-preview-sheet/appointment-preview-sheet';

@Component({
  selector: 'app-slot-picker',
  standalone: true,
  imports: [WeekDayPicker, TimeSlotButton, Button, SheetComponent, AppointmentPreviewSheet],
  templateUrl: './slot-picker.html',
})
export class SlotPicker implements OnInit {
  @Input() doctorId: string | null = null;

  slots = signal<any[]>([]);
  selectedSlot = signal<any | null>(null);

  doctorDetails: any;
  isLoading = signal(false);

  isSheetOpen = false;

  private srv = inject(GHOService);

  regularSlots = computed(() =>
    this.slots().filter((slot) => slot.IsTM === 0)
  );

  onlineConsultationSlots = computed(() =>
    this.slots().filter((slot) => slot.IsTM === 1)
  );

  ngOnInit(): void {
    this.onDateSelect(new Date());
  }

  onDateSelect(date: Date): void {
    if (!this.doctorId) return;
    this.selectedSlot.set(null);
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
          this.clearSlots();
        }
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Error fetching slots:', error);
        this.clearSlots();
        this.isLoading.set(false);
      },
    });
  }

  onSlotSelect(slot: any): void {
    this.selectedSlot.set(slot);
  }

  onContinue(): void {
    const slot = this.selectedSlot();

    if (!slot) return;
    this.openSheet();
  }

  openSheet(): void {
    this.isSheetOpen = true;
  }

  closeSheet(): void {
    this.isSheetOpen = false;
  }

  private clearSlots(): void {
    this.slots.set([]);
    this.doctorDetails = null;
  }
}