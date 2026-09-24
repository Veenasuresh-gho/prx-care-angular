import {
    Component,
    inject,
    Inject
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ghoresult, tags } from '../../../../models/gho-model';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../../services/gho.service';

@Component({
    selector: 'app-add-doctor-review',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './add-doctor-review.html',
    styleUrl: './add-doctor-review.css'
})
export class AddDoctorReview {
    reviewForm: FormGroup;
    selectedRating = 0;
    recommend = true;
    srv = inject(GHOService);
    private toastr = inject(ToastrService);
    isLoading = false;
    res: ghoresult = new ghoresult();

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddDoctorReview>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.reviewForm = this.fb.group({
            feedback: ['']
        });
    }

    setRating(rating: number): void {
        this.selectedRating = rating;
    }

    setRecommendation(value: boolean): void {
        this.recommend = value;
    }

    submit(): void {
        if (!this.selectedRating || this.isLoading) {
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('User ID not found');
            return;
        }

        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(this.data?.doctorId)
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: String(this.selectedRating)
            },
            {
                T: 'c2',
                V: String(this.recommend)
            },
            {
                T: 'c3',
                V: this.reviewForm.value.feedback || ''
            },
            {
                T: 'c10',
                V: '1'
            }
        ];

        this.isLoading = true;
        this.srv.getdata('doctorrating', tv).subscribe({
            next: (r) => {
                this.isLoading = false;

                if (r.Status === 1) {
                    const successMessage =
                        r.Data?.[0]?.[0]?.msg ||
                        'Review added successfully';

                    this.toastr.success(successMessage);
                    this.dialogRef.close({
                        ratingCount: this.selectedRating,
                        recommended: this.recommend,
                        feedback: this.reviewForm.value.feedback || ''
                    });

                    return;
                }

                this.toastr.error(
                    r.Info || 'Failed to add review'
                );
            },
            error: (err) => {
                console.error('Doctor Review API Error:', err);
                this.isLoading = false;

                this.toastr.error(
                    err?.error?.Info ||
                    err?.Message ||
                    'Something went wrong while adding the review'
                );
            }
        });
    }

    close(): void {
        if (!this.isLoading) {
            this.dialogRef.close();
        }
    }
}