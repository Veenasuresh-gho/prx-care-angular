import {
  ChangeDetectorRef,
  Component,
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
export class VitalsComponent  {

  activeTab = 0;
  selectedDate: Date = new Date();
  showDatePicker = false;
  vitalsByDate: any[] = [];
  recentVitals: any[] = [];
  editVitalData: any = null;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }
    this.selectedDate = date;
    this.showDatePicker = false;
  }

  onTabChange(index: number): void {
    this.activeTab = index;

    if (index === 2) {
      return;
    }

    if (index === 1) {

    }

    if (index === 0) {
    }
  }


}