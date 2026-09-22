import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { VitalCardComponent } from '../vital-card/vital-card';

@Component({
  selector: 'app-vitals-history',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    VitalCardComponent,
  ],
  templateUrl: './vitals-history.html',
  styleUrl: './vitals-history.css',
})
export class VitalsHistoryComponent {

  @Input() vitalsByDate: any;

  @Output() edit = new EventEmitter<any>();

  @Output() refetch = new EventEmitter<void>();


  onEdit(): void {
    this.edit.emit(this.vitalsByDate);
  }

}