import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { GHOService } from '../../../services/gho.service';
import { DoctorCard } from './doctor-card/doctor-card';
import { LocationService } from '../../../services/location-service';

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
  private locationService = inject(LocationService);

  private initialized = false;

  constructor() {
    effect(() => {
      this.locationService.locationChanged();

      if (this.initialized) {
        this.getDoctorList();
      }
    });
  }

  ngOnInit(): void {
    this.initialized = true;
    this.getDoctorList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results']) {
      this.doctorList = this.results;
      this.cdr.detectChanges();
    }
  }

  getDoctorList(): void {
    let place = '';

    try {
      const locationData = localStorage.getItem('navbar-location');
      const location = locationData ? JSON.parse(locationData) : null;
      place = location?.place || location?.district || location?.city || '';
    } catch {
      place = '';
    }

    const tv = [
      { T: 'dk2', V: place },
      { T: 'c10', V: '10' },
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