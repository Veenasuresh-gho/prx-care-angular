import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    inject
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';

@Component({
    selector: 'edit-allergy',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './edit-allergy.html',
    styleUrl: './edit-allergy.css'
})
export class EditAllergy implements OnChanges {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);

    @Input() allergy: any = null;
    @Output() saved = new EventEmitter<void>();

    constructor(private cdr: ChangeDetectorRef) {}

    allergyForm!: FormGroup;
    submitting = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['allergy'] && this.allergy) {
            this.createForm();
            this.patchForm();
        }
    }

    createForm(): void {
        this.allergyForm = this.fb.group({
            allergyDesc: [
                '',
                Validators.required
            ],
            allergyType: [
                '',
                Validators.required
            ],
            reportedInstitution: [
                ''
            ],
            initialOccurrence: [
                null,
                Validators.required
            ],
            allergicReaction: [
                ''
            ]
        });
    }

    patchForm(): void {
        this.allergyForm.patchValue({
            allergyDesc: this.allergy?.AllergyDesc || '',
            allergyType: this.allergy?.AllergyType || '',
            reportedInstitution:
                this.allergy?.ReportedInstitution || '',
            initialOccurrence:
                this.parseDate(this.allergy?.StartDate),
            allergicReaction:
                this.allergy?.AllergicReaction || ''
        });

        this.cdr.detectChanges();
    }

    submit(): void {
        if (this.allergyForm.invalid) {
            this.allergyForm.markAllAsTouched();
            return;
        }

        if (!this.allergy?.ID) {
            this.toastr.error('Allergy ID not found');
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }

        this.submitting = true;
        const formValue = this.allergyForm.value;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.allergy.ID
            },
              {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: formValue.allergyDesc
            },
            {
                T: 'c2',
                V: this.formatDate(
                    formValue.initialOccurrence
                )
            },
            {
                T: 'c4',
                V: formValue.allergicReaction
            },
            {
                T: 'c5',
                V: formValue.allergyType
            },
            {
                T: 'c6',
                V: formValue.reportedInstitution
            },
            {
                T: 'c10',
                V: '2'
            }
        ];

        this.srv
            .getdata(
                'patientallergy',
                tv
            )
            .subscribe({
                next: (r) => {
                    this.submitting = false;
                    if (r?.Status === 1) {
                        const successMessage =
                            r.Data?.[0]?.[0]?.msg ??
                            'Allergy updated successfully';

                        this.toastr.success(
                            successMessage
                        );
                        this.saved.emit();
                        return;
                    }
                    const errorMessage =
                        r.Info ||
                        'Failed to update allergy';
                    this.toastr.error(
                        errorMessage
                    );
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error(
                        'Edit Allergy API Error:',
                        err
                    );
                    this.submitting = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while updating allergy'
                    );
                    this.cdr.detectChanges();
                }
            });
    }

private parseDate(value: string | null): Date | null {
    if (!value) {
        return null;
    }
    const parts = value.split(' ');
    if (parts.length === 2) {
        const month = new Date(
            `${parts[0]} 1, ${parts[1]}`
        ).getMonth();
        const year = Number(parts[1]);
        if (
            isNaN(month) ||
            isNaN(year)
        ) {
            return null;
        }
        return new Date(
            year,
            month,
            1
        );
    }
    if (parts.length === 3) {
        const day = Number(parts[0]);
        const month = new Date(
            `${parts[1]} 1, ${parts[2]}`
        ).getMonth();
        const year = Number(parts[2]);
        if (
            isNaN(day) ||
            isNaN(month) ||
            isNaN(year)
        ) {
            return null;
        }
        return new Date(
            year,
            month,
            day
        );
    }
    return null;
}

    private formatDate(date: Date | null): string {
        if (!date) {
         return '';
        }
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
}
