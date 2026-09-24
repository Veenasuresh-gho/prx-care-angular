import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GHOService } from '../../../services/gho.service';
import { DoctorCard } from './doctor-card/doctor-card';

@Component({
  selector: 'app-doctor-list',
  imports: [DoctorCard],
  templateUrl: './doctor-list.html',
})
export class DoctorList implements OnInit, OnChanges {

  @Input() results: any[] = [];

  doctorList: any[] = [];

  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getDoctorList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results']) {
      this.doctorList = this.results;
      this.cdr.detectChanges();
    }
  }

  getDoctorList(): void {
    const tv = [
      {
        T: 'c10',
        V: '10',
      },
    ];

    this.srv.getdata('care', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.doctorList = res.Data[0] || [];
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      },
    });
  }
}