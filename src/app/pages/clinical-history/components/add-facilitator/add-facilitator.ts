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
    selector: 'add-facilitator',
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

    templateUrl: './add-facilitator.html',
    styleUrl: './add-facilitator.css'
})
export class AddFacilitator implements OnInit {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private utl = inject(GHOUtitity);
    private toastr = inject(ToastrService);
    @Output() saved = new EventEmitter<void>();
    facilitatorForm!: FormGroup;
    countries: Country[] = [];
    loadingCountries = false;
    submitting = false;
    selectedCountry: Country | null = null;
    constructor(private cdr: ChangeDetectorRef) { }

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


    createForm(): void {

        this.facilitatorForm = this.fb.group({
            facilityName: [
                '',
                Validators.required
            ],
            facilityType: [
                '',
                Validators.required
            ],
            visitSummary: [
                ''
            ],
            lastVisit: [
                null,
                Validators.required
            ],
            facilityPatientId: [
                ''
            ],
            countryId: [
                '',
                Validators.required
            ],
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


    onCountryChange(countryId: number): void {
        this.selectedCountry =
            this.countries.find(
                country =>
                    country.CountryID === countryId
            ) ?? null;
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

    getCountryList(): void {
        this.loadingCountries = true;
        const tv: tags[] = [
            {
                T: 'c10',
                V: '99'
            }
        ];
        this.srv.getdata(
            'lists',
            tv
        ).subscribe({
            next: (r) => {
                this.countries =
                    r.Data?.[0] ?? [];
                this.loadingCountries = false;
            },
            error: (err) => {
                console.error('Country API Error:', err);
                this.countries = [];
                this.loadingCountries = false;
                this.toastr.error('Failed to load countries');
            }
        });
    }


    submit(): void {
        if (this.facilitatorForm.invalid) {
            this.facilitatorForm.markAllAsTouched();
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
            this.facilitatorForm.value;
        const contactData = {
            FacilityName:
                formValue.facilityName,
            FacilityType:
                formValue.facilityType,
            VisitSummary:
                formValue.visitSummary,
            LastVisit:
                this.formatDate(
                    formValue.lastVisit
                ),
            FacilityPatientID:
                formValue.facilityPatientId,
            CountryID:
                formValue.countryId,
            Phone:
                formValue.phoneNumber,
            WebURL:
                formValue.webUrl,
            CredentialURL:
                formValue.credentialUrl
        };
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
                V: JSON.stringify(
                    contactData
                )
            },
            {
                T: 'c10',
                V: '1'
            }
        ];
        this.srv
            .getdata(
                'medicalfacilities',
                tv
            )
            .subscribe({
                next: (r) => {
                    this.submitting = false;
                    if (r?.Status === 1) {
                        const successMessage =
                            r.Data?.[0]?.[0]?.msg ??
                            'Facility added successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.facilitatorForm.reset();
                        this.selectedCountry = null;
                        this.saved.emit();
                        return;
                    }
                    this.submitting = false;
                    this.cdr.detectChanges();
                    const errorMessage =
                        r.Info ||
                        'Failed to add facility';
                    this.toastr.error(
                        errorMessage
                    );
                },
                error: (err) => {
                    console.error(
                        'Add Facility API Error:',
                        err
                    );
                    this.submitting = false;
                    this.cdr.detectChanges();
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while adding facility'
                    );
                }
            });
    }

    private formatDate(date: Date | null): string {
        if (!date) {
            return '';
        }
        const day =
            String(
                date.getDate()
            ).padStart(2, '0');
        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}