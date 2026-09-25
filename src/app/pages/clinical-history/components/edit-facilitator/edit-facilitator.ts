import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ToastrService } from 'ngx-toastr';

import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { tags } from '../../../../models/gho-model';

interface Country {
    CountryID: number;
    CountryName: string;
    CountryCode: string;
    MinLength: number;
    MaxLength: number;
}

@Component({
    selector: 'edit-facilitator',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './edit-facilitator.html',
    styleUrl: './edit-facilitator.css'
})
export class EditFacilitator implements OnInit, OnChanges {
    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private utl = inject(GHOUtitity);
    private toastr = inject(ToastrService);

    @Input() facilitator: any;
    @Output() saved = new EventEmitter<void>();
    constructor(private cdr: ChangeDetectorRef) { }

    facilitatorForm!: FormGroup;
    countries: Country[] = [];
    loadingCountries = false;
    submitting = false;
    selectedCountry: Country | null = null;

    facilityTypeOptions = [
        {
            label: 'Hospital',
            value: 'hospital'
        },
        {
            label: 'Clinic',
            value: 'clinic'
        },
        {
            label: 'Diagnostic Center',
            value: 'diagnostic_center'
        },
        {
            label: 'Pharmacy',
            value: 'pharmacy'
        },
        {
            label: 'Laboratory',
            value: 'laboratory'
        },
        {
            label: 'Medical Center',
            value: 'medical_center'
        },
        {
            label: 'Other',
            value: 'other'
        }
    ];

    ngOnInit(): void {
        this.createForm();
        this.getCountryList();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['facilitator'] &&
            this.facilitator &&
            this.facilitatorForm
        ) {
            this.patchForm();
        }
    }

    createForm(): void {
        this.facilitatorForm = this.fb.group({
            facilityName: ['', Validators.required],
            facilityType: ['', Validators.required],
            visitSummary: [''],
            lastVisit: [null, Validators.required],
            facilityPatientId: [''],
            countryId: ['', Validators.required],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]+$/)
                ]
            ],
            webUrl: [
                '',
                Validators.pattern(
                    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
                )
            ],
            credentialUrl: [
                '',
                Validators.pattern(
                    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
                )
            ]
        });
    }

    getCountryList(): void {
        this.loadingCountries = true;

        const tv: tags[] = [
            {
                T: 'c10',
                V: '99'
            }
        ];

        this.srv.getdata('lists', tv).subscribe({
            next: (r) => {
                this.countries = r.Data?.[0] ?? [];
                this.loadingCountries = false;
                this.patchForm();
            },
            error: (err) => {
                console.error('Country API Error:', err);
                this.countries = [];
                this.loadingCountries = false;
                this.toastr.error('Failed to load countries');
            }
        });
    }

    patchForm(): void {
        if (!this.facilitator || !this.facilitatorForm) {
            return;
        }

        const countryId =
            this.facilitator.CountryID ??
            this.facilitator.countryId ??
            '';

        this.selectedCountry =
            this.countries.find(
                country => country.CountryID == countryId
            ) ?? null;

        this.facilitatorForm.patchValue({
            facilityName:
                this.facilitator.FacilityName ??
                this.facilitator.facilityName ??
                '',

            facilityType:
                this.facilitator.FacilityType ??
                this.facilitator.facilityType ??
                '',

            visitSummary:
                this.facilitator.VisitSummary ??
                this.facilitator.visitSummary ??
                '',

            lastVisit:
                this.parseDate(
                    this.facilitator.LastVisit ??
                    this.facilitator.lastVisit
                ),

            facilityPatientId:
                this.facilitator.FacilityPatientID ??
                this.facilitator.facilityPatientId ??
                '',

            countryId: countryId,

            phoneNumber:
                this.facilitator.Phone ??
                this.facilitator.phoneNumber ??
                '',

            webUrl:
                this.facilitator.WebUrl ??
                this.facilitator.webUrl ??
                '',

            credentialUrl:
                this.facilitator.CredentialUrl ??
                this.facilitator.credentialUrl ??
                ''
        });

        if (this.selectedCountry) {
            this.setPhoneValidators();
        }
    }

    onCountryChange(countryId: number): void {
        this.selectedCountry =
            this.countries.find(
                country => country.CountryID === countryId
            ) ?? null;

        this.setPhoneValidators();
    }

    private setPhoneValidators(): void {
        const phoneControl =
            this.facilitatorForm.get('phoneNumber');

        if (!phoneControl || !this.selectedCountry) {
            return;
        }

        phoneControl.setValidators([
            Validators.required,
            Validators.minLength(
                this.selectedCountry.MinLength
            ),
            Validators.maxLength(
                this.selectedCountry.MaxLength
            ),
            Validators.pattern(/^[0-9]+$/)
        ]);

        phoneControl.updateValueAndValidity();
    }

    private parseDate(value: any): Date | null {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            return value;
        }

        if (
            typeof value === 'string' &&
            value.includes('/')
        ) {
            const parts = value.split('/');

            if (parts.length === 3) {
                return new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                );
            }
        }

        if (
            typeof value === 'string' &&
            value.includes('-')
        ) {
            const parts = value
                .substring(0, 10)
                .split('-');

            if (parts.length === 3) {
                return new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    Number(parts[2])
                );
            }
        }

        return null;
    }

    private formatDate(date: Date | null): string {
        if (!date) {
            return '';
        }
        const day = String(
            date.getDate()
        ).padStart(2, '0');
        const month = String(
            date.getMonth() + 1
        ).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    submit(): void {
        if (this.facilitatorForm.invalid) {
            this.facilitatorForm.markAllAsTouched();
            return;
        }
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }

        const facilitatorId =
            this.facilitator?.ID ??
            this.facilitator?.Id ??
            this.facilitator?.FacilityID ??
            this.facilitator?.facilityId;

        if (!facilitatorId) {
            this.toastr.error('Facilitator ID not found');
            return;
        }
        this.submitting = true;
        const formValue =
            this.facilitatorForm.value;
        const facilitatorData = {
            FacilityName: formValue.facilityName,
            FacilityType: formValue.facilityType,
            VisitSummary: formValue.visitSummary,
            LastVisit: this.formatDate(
                formValue.lastVisit
            ),
            FacilityPatientID:
                formValue.facilityPatientId,
            CountryID: formValue.countryId,
            Phone: formValue.phoneNumber,
            WebUrl: formValue.webUrl,
            CredentialUrl: formValue.credentialUrl
        };

        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(facilitatorId)
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: JSON.stringify(facilitatorData)
            },
            {
                T: 'c10',
                V: '2'
            }
        ];

        this.srv
            .getdata('medicalfacilities', tv)
            .subscribe({
                next: (r) => {
                    this.submitting = false;
                    if (r?.Status === 1) {
                        const successMessage =
                            r.Data?.[0]?.[0]?.msg ??
                            'Facility updated successfully';

                        this.toastr.success(
                            successMessage
                        );

                        this.saved.emit();
                        return;
                    }
                    this.submitting = false;
                    this.cdr.detectChanges();
                    this.toastr.error(
                        r.Info ||
                        'Failed to update facility'
                    );
                },
                error: (err) => {
                    console.error(
                        'Edit Facility API Error:',
                        err
                    );
                    this.submitting = false;
                    this.cdr.detectChanges();
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while updating facility'
                    );
                }
            });
    }
}



