import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { VitalsHistoryComponent } from './components/vital-history/vitals-history';
import { RecentVitalsComponent } from './components/recent-vitals/recent-vitals';
import { AddVitalsComponent } from './components/add-vitals/add-vitals';


@Component({
  selector: 'app-vitals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    RecentVitalsComponent,
    VitalsHistoryComponent,
    AddVitalsComponent
  ],
  templateUrl: './vitals.html',
  styleUrl: './vitals.css',
})
export class VitalsComponent implements OnInit {

  activeTab = 0;

  selectedDate: Date = new Date();

  showDatePicker = false;

  vitalsByDate: any[] = [];

  recentVitals: any[] = [];

  editVitalData: any = null;

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVitals();
    this.loadRecentVitals();
  }

  /**
   * Load vitals based on selected date
   */
  loadVitals(): void {
    // Replace this with your API/service call
    //
    // Example:
    //
    // this.vitalsService.getVitalsByDate(
    //   this.userId,
    //   this.selectedDate
    // ).subscribe({
    //   next: (response) => {
    //     this.vitalsByDate = response?.Data ?? [];
    //   }
    // });

    console.log('Load vitals for:', this.selectedDate);
  }

  /**
   * Load recent vitals
   */
  loadRecentVitals(): void {
    // Replace this with your API/service call
    //
    // this.vitalsService.getRecentVitals(this.userId)
    //   .subscribe({
    //     next: (response) => {
    //       this.recentVitals = response?.Data ?? [];
    //     }
    //   });

    console.log('Load recent vitals');
  }

  /**
   * Called when calendar date changes
   */
  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    this.selectedDate = date;
    this.showDatePicker = false;

    this.loadVitals();
  }

  /**
   * Edit vital
   */
  handleEdit(vital: any): void {
    this.editVitalData = vital;

    // Switch to Add Vitals tab
    this.activeTab = 2;

    this.cdr.detectChanges();
  }

  /**
   * Reset edit mode
   */
  handleResetEdit(): void {
    this.editVitalData = null;

    // Go back to Recent Vitals
    this.activeTab = 0;
  }

  /**
   * Called after adding/updating vitals
   */
  handleVitalsUpdated(): void {
    this.loadVitals();
    this.loadRecentVitals();

    this.editVitalData = null;
  }

  /**
   * Tab changed
   */
  onTabChange(index: number): void {
    this.activeTab = index;

    if (index === 2) {
      // Add Vitals
      return;
    }

    if (index === 1) {
      // History
      this.loadVitals();
    }

    if (index === 0) {
      // Recent
      this.loadRecentVitals();
    }
  }

  /**
   * Format date for display
   */
  get formattedDate(): string {
    return this.selectedDate
      ? this.selectedDate.toDateString()
      : 'Select date';
  }
}