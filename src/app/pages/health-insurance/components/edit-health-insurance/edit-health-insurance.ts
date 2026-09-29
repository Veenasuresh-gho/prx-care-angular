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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MatIconModule} from '@angular/material/icon';
import {ToastrService} from 'ngx-toastr';
import {GHOService} from '../../../../services/gho.service';
import {FileUploadService} from '../../../../services/file-upload-service';
import {tags} from '../../../../models/gho-model';

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
        MatNativeDateModule,
        MatIconModule
    ],

    templateUrl: './edit-health-insurance.html',
    styleUrl: './edit-health-insurance.css'
})
export class EditHealthInsurance implements OnChanges {
    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);
    private fileUploadService =
        inject(FileUploadService);

    @Input() insurance: any = null;
    @Output() saved = new EventEmitter<void>();

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    insuranceForm!: FormGroup;
    submitting = false;
    loadingFile = false;
    deletingFile = false;
    patientId: string | null = null;
    uploadedFile: any = null;
    selectedFile: File | null = null;
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['insurance'] &&
            this.insurance
        ) {
            this.patientId =
                sessionStorage.getItem('id');
            this.createForm();
            this.patchForm();
            this.getInsuranceDetails();
        }
    }

    createForm(): void {

        this.insuranceForm =
            this.fb.group({
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
            insuranceName:
                this.insurance?.InsuranceName || '',

            policyNumber:
                this.insurance?.InsurancePolicyID || '',

            startDate:
                this.parseDate(
                    this.insurance?.StartDate
                ),

            endDate:
                this.parseDate(
                    this.insurance?.EndDate
                )
        });

        this.cdr.detectChanges();
    }

    getInsuranceDetails(): void {
        if (!this.insurance?.ID) {
            return;
        }
        const userId =
            this.patientId ??
            sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error(
                'Patient ID not found'
            );
            return;
        }
        this.loadingFile = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(this.insurance.ID)
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv
            .getdata(
                'PatientInsurance',
                tv
            )
            .subscribe({
                next: (r) => {
                    this.loadingFile = false;
                    if (r?.Status !== 1) {
                        this.toastr.error(
                            r?.Info ||
                            'Unable to load insurance details'
                        );
                        return;
                    }
                    const insuranceData =
                        r?.Data?.[0]?.[0];
                    const files =
                        r?.Data?.[1] ?? [];
                    if (insuranceData) {
                        this.insurance =
                            insuranceData;
                        this.patchForm();
                    }

                    this.uploadedFile =
                        files.length > 0
                            ? files[0]
                            : null;
                    this.cdr.detectChanges();
                },

                error: (err) => {
                    console.error(
                        'Get Insurance Details API Error:',
                        err
                    );
                    this.loadingFile = false;
                    this.toastr.error(
                        'Unable to load insurance document'
                    );

                    this.cdr.detectChanges();
                }
            });
    }

    onFileSelected(
        event: Event
    ): void {

        const input =
            event.target as HTMLInputElement;
        const file =
            input.files?.[0] ?? null;
        if (!file) {
            return;
        }
        this.selectedFile = file;
    }

    removeSelectedFile(): void {
        this.selectedFile = null;
    }

    viewFile(): void {
        if (!this.uploadedFile?._url) {
            return;
        }
        window.open(
            this.uploadedFile._url,
            '_blank'
        );
    }

    deleteFile(): void {

        if (
            !this.uploadedFile?.id ||
            this.deletingFile
        ) {
            return;
        }
        const patientId =
            this.patientId ??
            sessionStorage.getItem('id');
        if (!patientId) {
            this.toastr.error(
                'Patient ID not found'
            );
            return;
        }
        this.deletingFile = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: patientId
            },
            {
                T: 'dk2',
                V: String(this.uploadedFile.id)
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv
            .getdata(
                'fileupload',
                tv
            )
            .subscribe({
                next: (r) => {
                    if (r?.Status === 1) {
                        this.toastr.success(
                            r?.Data?.[0]?.[0]?.msg ||
                            'File deleted successfully'
                        );
                        this.uploadedFile = null;
                        this.deletingFile = false;
                        this.cdr.detectChanges();
                        return;
                    }
                    this.deletingFile = false;
                    this.toastr.error(
                        r?.Info ||
                        'Failed to delete file'
                    );
                    this.getInsuranceDetails()
                    this.cdr.detectChanges();
                },

                error: (err) => {
                    console.error(
                        'Delete Insurance File Error:',
                        err
                    );
                    this.deletingFile = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while deleting file'
                    );
                    this.cdr.detectChanges();
                }
            });
    }

    async submit(): Promise<void> {
        if (this.submitting) {
            return;
        }

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

        const userId =
            sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error(
                'Patient ID not found'
            );
            return;
        }

        this.submitting = true;
        const formValue =
            this.insuranceForm.value;

        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(this.insurance.ID)
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
                next: async (r) => {
                    if (r?.Status !== 1) {
                        this.submitting = false;
                        this.toastr.error(
                            r?.Info ||
                            'Failed to update health insurance'
                        );
                        return;
                    }

                    if (this.selectedFile) {
                        const uploadSuccess =
                            await this.fileUploadService
                                .handleFileUpload(
                                    String(
                                        this.insurance.ID
                                    ),
                                    userId,
                                    this.selectedFile,
                                    '2'
                                );
                        if (!uploadSuccess) {
                            this.submitting = false;
                            return;
                        }
                    }
                    const successMessage =
                        r?.Data?.[0]?.[0]?.msg ??
                        'Health insurance updated successfully';
                    this.toastr.success(
                        successMessage
                    );
                    this.selectedFile = null;
                    this.submitting = false;
                    this.saved.emit();
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
        const cleaned =
            value
                .replace(',', '')
                .trim();

        const parts =
            cleaned.split(/\s+/);

        if (parts.length !== 3) {
            return null;
        }

        const day =
            Number(parts[0]);
        const month =
            new Date(
                `${parts[1]} 1, ${parts[2]}`
            ).getMonth();
        const year =
            Number(parts[2]);
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
