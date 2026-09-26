import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
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
    selector: 'add-allergy',
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
    templateUrl: './add-allergy.html',
    styleUrl: './add-allergy.css'
})
export class AddAllergy implements OnInit {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);

    @Output() saved = new EventEmitter<void>();
    constructor(private cdr: ChangeDetectorRef) { }
    allergyForm!: FormGroup;
    submitting = false;

    ngOnInit(): void {
        this.createForm();
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

    submit(): void {
        if (this.allergyForm.invalid) {
            this.allergyForm.markAllAsTouched();
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
                V: '1'
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
                            'Allergy added successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.allergyForm.reset();
                        this.saved.emit();
                        return;
                    }
                    this.submitting = false;
                    this.cdr.detectChanges();
                    const errorMessage =
                        r.Info ||
                        'Failed to add allergy';
                    this.toastr.error(
                        errorMessage
                    );
                },
                error: (err) => {
                    console.error(
                        'Add Allergy API Error:',
                        err
                    );
                    this.submitting = false;
                    this.cdr.detectChanges();
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while adding allergy'
                    );
                }
            });
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
