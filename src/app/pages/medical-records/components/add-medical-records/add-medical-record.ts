import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../../services/gho.service';
import { FileUploadService } from '../../../../services/file-upload-service';
import { tags } from '../../../../models/gho-model';

@Component({
    selector: 'add-medical-record',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './add-medical-record.html',
    styleUrl: './add-medical-record.css'
})
export class AddMedicalRecord implements OnInit {
    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);
    private fileUploadService = inject(FileUploadService);
    private cdr = inject(ChangeDetectorRef);
    @Output() saved = new EventEmitter<void>();

    medicalRecordForm!: FormGroup;
    submitting = false;
    selectedFile: File | null = null;
    patientId: string | null = null;

    readonly fileCategory = [
        {
            label: 'Prescriptions & Medications',
            value: '2',
            typeList: [
                {
                    label: 'Doctor Prescriptions',
                    value: '1'
                },
                {
                    label: 'Medication Lists',
                    value: '2'
                },
                {
                    label: 'Pharmacy Receipts',
                    value: '3'
                }
            ]
        },
        {
            label: 'Test Results & Reports',
            value: '1',
            typeList: [
                {
                    label: 'Lab Tests & Pathology',
                    value: '1'
                },
                {
                    label: 'Scans & Imaging',
                    value: '2'
                },
                {
                    label: 'Heart, Lungs & Neurology Tests',
                    value: '3'
                },
                {
                    label: 'Specialized & Genetic Tests',
                    value: '4'
                }
            ]
        },
        {
            label: 'Hospital & Treatment Records',
            value: '3',
            typeList: [
                {
                    label: 'Discharge Summaries',
                    value: '1'
                },
                {
                    label: 'Admission Notes',
                    value: '2'
                },
                {
                    label: 'Surgery Reports',
                    value: '3'
                },
                {
                    label: 'Treatment Plans',
                    value: '4'
                }
            ]
        },
        {
            label: 'Immunization & Preventive Care',
            value: '4',
            typeList: [
                {
                    label: 'Vaccination Records',
                    value: '1'
                },
                {
                    label: 'Preventive Health Checkup Reports',
                    value: '2'
                }
            ]
        }
    ];

    ngOnInit(): void {
        this.patientId = sessionStorage.getItem('id');
        this.createForm();
    }

    createForm(): void {
        this.medicalRecordForm = this.fb.group({
            documentCategory: ['', Validators.required],
            documentType: ['', Validators.required]
        });

        this.medicalRecordForm
            .get('documentCategory')
            ?.valueChanges
            .subscribe(() => {
                this.medicalRecordForm
                    .get('documentType')
                    ?.reset('');
            });
    }

    get selectedCategory() {
        const category =
            this.medicalRecordForm
                .get('documentCategory')
                ?.value;

        return this.fileCategory.find(
            item => item.value === category
        );
    }

    get isPdf(): boolean {
        return this.selectedFile?.type === 'application/pdf';
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files?.[0] ?? null;
    }

    removeFile(): void {
        this.selectedFile = null;
    }

    async submit(): Promise<void> {
        if (this.submitting) {
            return;
        }
        if (this.medicalRecordForm.invalid) {
            this.medicalRecordForm.markAllAsTouched();
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }
        if (!this.selectedFile) {
            this.toastr.error('Please select a document');
            return;
        }
        this.submitting = true;
        const formValue = this.medicalRecordForm.value;
        const tv: tags[] = [
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: this.selectedFile?.name || ''
            },
            {
                T: 'c2',
                V: this.selectedCategory?.label || ''
            },
            {
                T: 'c10',
                V: '1'
            }
        ];
        this.srv
            .getdata('patientmedicalrecord', tv)
            .subscribe({
                next: async (r) => {
                    if (r?.Status !== 1) {
                        this.submitting = false;
                        this.toastr.error(
                            r?.Info ||
                            'Failed to add medical record'
                        );
                        return;
                    }
                    const medicalRecordId =
                        r?.Data?.[0]?.[0]?.id;
                    if (!medicalRecordId) {
                        this.submitting = false;
                        this.toastr.error(
                            'Medical record was added, but record ID was not returned'
                        );
                        return;
                    }
                    const uploadSuccess =
                        await this.fileUploadService
                            .handleFileUpload(
                                String(medicalRecordId),
                                userId,
                                this.selectedFile!,
                                '4',
                                formValue.documentCategory,
                                Number(formValue.documentCategory)
                            );
                    if (!uploadSuccess) {
                        this.submitting = false;
                        return;
                    }
                    this.toastr.success(
                        r?.Data?.[0]?.[0]?.msg ||
                        'Medical record added successfully'
                    );
                    this.medicalRecordForm.reset();
                    this.selectedFile = null;
                    this.submitting = false;
                    this.saved.emit();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error(
                        'Add Medical Record API Error:',
                        err
                    );
                    this.submitting = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while adding medical record'
                    );
                    this.cdr.detectChanges();
                }
            });
    }

}
