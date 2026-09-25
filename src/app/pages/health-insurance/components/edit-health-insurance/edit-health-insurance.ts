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
    selector: 'edit-health-insurance',
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
    templateUrl: './edit-health-insurance.html',
    styleUrl: './edit-health-insurance.css'
})
export class EditHealthInsurance implements OnChanges {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);

    @Input() insurance: any = null;
    @Output() saved = new EventEmitter<void>();

    constructor(private cdr: ChangeDetectorRef) { }

    insuranceForm!: FormGroup;
    submitting = false;
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['insurance'] && this.insurance) {
            this.createForm();
            this.patchForm();
        }
    }

    createForm(): void {
        this.insuranceForm = this.fb.group({
            insuranceName: [
                '',
                Validators.required
            ],
            policyNumber: [
                '',
                Validators.required
            ],
            startDate: [
                null,
                Validators.required
            ],
            endDate: [
                null
            ]
        });
    }

    patchForm(): void {
        this.insuranceForm.patchValue({
            insuranceName: this.insurance?.InsuranceName || '',
            policyNumber: this.insurance?.InsurancePolicyID || '',
            startDate: this.parseDate(
                this.insurance?.StartDate
            ),
            endDate: this.parseDate(
                this.insurance?.EndDate
            )
        });
        this.cdr.detectChanges();
    }

    submit(): void {
        if (this.insuranceForm.invalid) {
            this.insuranceForm.markAllAsTouched();
            return;
        }

        if (!this.insurance?.ID) {
            this.toastr.error(
                'Insurance ID not found'
            );
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }

        this.submitting = true;
        const formValue =
            this.insuranceForm.value;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.insurance.ID
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: formValue.insuranceName
            },
            {
                T: 'c2',
                V: formValue.policyNumber
            },
            {
                T: 'c3',
                V: this.formatDate(
                    formValue.startDate
                )
            },
            {
                T: 'c4',
                V: this.formatDate(
                    formValue.endDate
                )
            },
            {
                T: 'c10',
                V: '2'
            }
        ];

        this.srv
            .getdata(
                'PatientInsurance',
                tv
            )
            .subscribe({
                next: (r) => {
                    this.submitting = false;
                    if (r?.Status === 1) {
                        const successMessage =
                            r.Data?.[0]?.[0]?.msg ??
                            'Health insurance updated successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.saved.emit();
                        return;
                    }
                    this.submitting = false;
                    const errorMessage =
                        r.Info ||
                        'Failed to update health insurance';

                    this.toastr.error(
                        errorMessage
                    );
                    this.cdr.detectChanges();
                },

                error: (err) => {
                    console.error(
                        'Edit Health Insurance API Error:',
                        err
                    );
                    this.submitting = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while updating health insurance'
                    );
                    this.cdr.detectChanges();
                }
            });
    }

    private parseDate(
        value: string | null
    ): Date | null {

        if (!value) {
            return null;
        }

        const parts = value.split(' ');

        if (parts.length !== 3) {
            return null;
        }

        const day = Number(
            parts[0]
        );

        const month = new Date(
            `${parts[1]} 1, ${parts[2]}`
        ).getMonth();

        const year = Number(
            parts[2].replace(',', '')
        );

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

    private formatDate(
        date: Date | null
    ): string {

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

        const day =
            date.getDate();

        const month =
            months[date.getMonth()];

        const year =
            date.getFullYear();

        return `${day} ${month} ${year}`;
    }
}
