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
    selector: 'add-health-insurance',
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
    templateUrl: './add-health-insurance.html',
    styleUrl: './add-health-insurance.css'
})
export class AddHealthInsurance implements OnInit {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);
    @Output() saved = new EventEmitter<void>();
    constructor(private cdr: ChangeDetectorRef) {}

    insuranceForm!: FormGroup;
    submitting = false;

    ngOnInit(): void {
        this.createForm();
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

    submit(): void {
        if (this.insuranceForm.invalid) {
            this.insuranceForm.markAllAsTouched();
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }

        this.submitting = true;
        const formValue = this.insuranceForm.value;
        const tv: tags[] = [
              {
                T: 'dk1',
                V: ''
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
                V: '1'
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
                        const successMessage = r.Data?.[0]?.[0]?.msg ?? 'Health insurance added successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.insuranceForm.reset();
                        this.saved.emit();
                        return;
                    }
                     this.submitting = false;
                    const errorMessage =
                        r.Info ||
                        'Failed to add health insurance';
                    this.toastr.error(
                        errorMessage
                    );
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error(
                        'Add Health Insurance API Error:',
                        err
                    );
                    this.submitting = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while adding health insurance'
                    );
                    this.cdr.detectChanges();
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
