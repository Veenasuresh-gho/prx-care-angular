import {
    ChangeDetectorRef,
    Component,
    OnInit,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../models/gho-model';
import { LabTests } from '../lab-tests/lab-tests';

@Component({
    selector: 'lab-details',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        LabTests
    ],
    templateUrl: './lab-details.html',
    styleUrl: './lab-details.css'
})
export class LabDetails implements OnInit {

    private srv = inject(GHOService);
    private utl = inject(GHOUtitity);
    private route = inject(ActivatedRoute);
    res: ghoresult = new ghoresult();
    loading = false;
    labDetails: any[] = [];
    advertisements: any[] = [];
    interiors: any[] = [];
    labId: string | null = null;
    currentAdIndex = 0;
    showLabServices = false;
    selectedServiceType: number | null = null;

    constructor(
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.labId = this.route.snapshot.paramMap.get('id');
        if (this.labId) {
            this.getLabDetails();
        }
    }

    getLabDetails(): void {
        if (!this.labId) {
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.labId
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv.getdata('findlab', tv).subscribe({
            next: (r) => {
                this.labDetails = r.Data?.[0] ?? [];
                this.advertisements = r.Data?.[1] ?? [];
                this.interiors = r.Data?.[2] ?? [];
                this.currentAdIndex = 0;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Lab Details API Error:', err);
                this.labDetails = [];
                this.advertisements = [];
                this.interiors = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openLabServices(type: number): void {
        this.selectedServiceType = type;
        this.showLabServices = true;
    }

    closeLabServices(): void {
        this.showLabServices = false;
        this.selectedServiceType = null;
    }

    previousAd(): void {
        if (!this.advertisements.length) {
            return;
        }

        this.currentAdIndex =
            this.currentAdIndex === 0
                ? this.advertisements.length - 1
                : this.currentAdIndex - 1;
    }

    nextAd(): void {
        if (!this.advertisements.length) {
            return;
        }

        this.currentAdIndex =
            this.currentAdIndex === this.advertisements.length - 1
                ? 0
                : this.currentAdIndex + 1;
    }

    goToAd(index: number): void {
        this.currentAdIndex = index;
    }
}
