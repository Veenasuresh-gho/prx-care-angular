import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GHOService } from '../../../services/gho.service';
import { DoctorCard } from './doctor-card/doctor-card';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [DoctorCard, MatProgressSpinnerModule],
  templateUrl: './doctor-list.html',
})
export class DoctorList implements OnInit, OnChanges {

  @Input() results: any[] = [];
  @Input() loading = false;

  doctorList: any[] = [];
  isLoading = true;

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getDoctorList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results']) {
      this.doctorList = this.results || [];
      this.cdr.detectChanges();
    }
  }

  getDoctorList(): void {
    this.isLoading = true;

    const tv = [
      {
        T: 'c10',
        V: '10',
      },
    ];

    this.srv.getdata('care', tv)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          if (res.Status === 1) {
            this.doctorList = res.Data[0] || [];
          }
        },
        error: (error) => {
          console.error('Error fetching doctors:', error);
        },
      });
  }
}