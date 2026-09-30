import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { GHOService } from '../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';
import { MilestoneAccordion } from './components/milestone-accordion/milestone-accordion';

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [
    MilestoneAccordion,
  ],
  templateUrl: './milestones.html',
})
export class Milestones implements OnInit {

  private readonly srv = inject(GHOService);
  private readonly toastr = inject(ToastrService);
  private readonly cdr = inject(ChangeDetectorRef);

  milestones: any[] = [];

  isLoading = false;

  patientId: string | null = null;


  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
    this.getMilestones();
  }

  getMilestones(): void {

    if (!this.patientId) {
      return;
    }
    this.isLoading = true;
    const tv = [
      {
        T: 'dk2',
        V: this.patientId,
      },
      {
        T: 'c10',
        V: '4',
      },
    ];
    this.srv.getdata('childgrowth', tv).subscribe({
      next: (res) => {
        if (res?.Status === 1) {
          this.milestones = res?.Data?.[0] ?? [];
        } else {
          this.milestones = [];
          this.toastr.error(
            res?.Info || 'Unable to load milestones'
          );
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'Milestones error:',
          error
        );
        this.milestones = [];
        this.isLoading = false;
        this.toastr.error(
          'Unable to load milestones'
        );
        this.cdr.detectChanges();
      },
    });
  }
}

