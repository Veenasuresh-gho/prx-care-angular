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
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-slot-picker',
  standalone: true,
  imports: [
    WeekDayPicker,
    TimeSlotButton,
    Button,
    SheetComponent,
    AppointmentPreviewSheet,
    JsonPipe
  ],
  templateUrl: './slot-picker.html',
})
export class SlotPicker implements OnInit {
  @Input() doctorId: string | null = null;
  @Input() doctor: any = null;


  slots = signal<any[]>([]);
  selectedSlot = signal<any | null>(null);
  selectedDate = signal<Date>(new Date());
  doctorDetails = signal<any>(null);
  patientDetails = signal<any>(null);

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

    this.selectedDate.set(date);
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
          console.log(res)
          this.slots.set(res.Data[0] || []);
          this.doctorDetails.set(res.Data[1]?.[0] || null);
          this.patientDetails.set(res.Data[2]?.[0] || null);
        } else {
          this.clearSlots();
        }

        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Error fetching slots:', error);
        this.clearSlots();
        this.doctorDetails.set(null);
        this.patientDetails.set(null);
        this.isLoading.set(false);
      },
    });
  }

  onSlotSelect(slot: any): void {
    this.selectedSlot.set(slot);
  }

  onContinue(): void {
    if (!this.selectedSlot()) return;

    this.isSheetOpen = true;
  }

  closeSheet(): void {
    this.isSheetOpen = false;
  }

  private clearSlots(): void {
    this.slots.set([]);
  }
}