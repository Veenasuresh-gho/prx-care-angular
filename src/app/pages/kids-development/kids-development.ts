import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { DatePicker } from '../../components/date-picker/date-picker';
import { Button } from '../../components/button/button';

import { Empty } from './components/empty/empty';
import { KidsDevelopmentDetailsContainer } from './components/kids-development-details-container/kids-development-details-container';

import { formatDateToDDMMYYYY } from '../../utils/date';
import { GHOService } from '../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kids-development',
  standalone: true,
  imports: [
    DatePicker,
    Button,
    Empty,
    KidsDevelopmentDetailsContainer
  ],
  templateUrl: './kids-development.html',
})
export class KidsDevelopment implements OnInit {
  private readonly srv = inject(GHOService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  details: any = null;
  dob: Date | undefined;
  isLoading = false;
  patientId: string | null = null;

  onDobChange(date: Date | undefined): void {
    this.dob = date;
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
  }

  handleTrack(): void {
    if (!this.dob) {
      return;
    }

    this.isLoading = true;

    const year = this.dob.getFullYear();
    const month = String(this.dob.getMonth() + 1).padStart(2, '0');
    const day = String(this.dob.getDate()).padStart(2, '0');

    const dobString = `${year}-${month}-${day}`;

    const tv = [
      {
        T: 'dk2',
        V: this.patientId ?? '',
      },
      {
        T: 'c1',
        V: formatDateToDDMMYYYY(dobString),
      },
      {
        T: 'c10',
        V: '1',
      },
    ];

    this.srv.getdata('childgrowth', tv).subscribe({
      next: (res) => {
        if (res?.Status === 1 && res?.Data?.[0]?.[0]) {
          this.details = res.Data[0][0];
        } else {
          this.details = null;

          this.toastr.error(
            res?.Info || 'No development details found'
          );
        }

        this.isLoading = false;

        // Immediately update the UI
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Kids development error:',
          error
        );

        this.details = null;
        this.isLoading = false;

        this.toastr.error(
          'Unable to load child development details'
        );

        // Immediately update the UI
        this.cdr.detectChanges();
      },
    });
  }

  seeMilestones(): void {
    this.router.navigate(['/kids-development/milestones']);
  }
}

