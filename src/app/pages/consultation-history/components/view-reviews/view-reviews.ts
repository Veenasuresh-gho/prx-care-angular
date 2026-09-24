import {
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    OnInit
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-view-reviews',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './view-reviews.html',
    styleUrl: './view-reviews.css'
})
export class ViewReviews implements OnInit {
    srv = inject(GHOService);
    private toastr = inject(ToastrService);
    res: ghoresult = new ghoresult();
    reviews: any[] = [];
    isLoading = false;

    constructor(
        private dialogRef: MatDialogRef<ViewReviews>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.getReviews();
    }

    getReviews(): void {
        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(this.data?.doctorId)
            },
            {
                T: 'dk2',
                V: ''
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.isLoading = true;
        this.srv.getdata('doctorrating', tv).subscribe({
            next: (r) => {
                if (r.Status === 1) {
                    this.reviews = r.Data?.[0] || [];
                } else {
                    this.reviews = [];
                    this.toastr.error(
                        r.Info || 'Failed to load reviews'
                    );
                }

                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.reviews = [];
                console.error('Doctor Reviews API Error:', err);
                this.toastr.error(
                    err?.error?.Info ||
                    err?.Message ||
                    'Something went wrong while loading reviews'
                );
                this.cdr.detectChanges();
            }
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}