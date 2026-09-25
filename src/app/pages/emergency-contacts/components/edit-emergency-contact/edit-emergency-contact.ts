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
    selector: 'edit-emergency-contact',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './edit-emergency-contact.html',
    styleUrl: './edit-emergency-contact.css'
})
export class EditEmergencyContact implements OnInit,OnChanges  {
    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private utl = inject(GHOUtitity);
    private toastr = inject(ToastrService);

    @Input() selectedContact: any = null;
    @Output() saved = new EventEmitter<void>();

    emergencyContactForm!: FormGroup;
    countries: Country[] = [];
    loadingCountries = false;
    submitting = false;
    selectedCountry: Country | null = null;
    constructor(private cdr: ChangeDetectorRef) { }

    relationOptions = [
        {
            label: 'Father',
            value: 'father'
        },
        {
            label: 'Mother',
            value: 'mother'
        },
        {
            label: 'Spouse',
            value: 'spouse'
        },
        {
            label: 'Son',
            value: 'son'
        },
        {
            label: 'Daughter',
            value: 'daughter'
        },
        {
            label: 'Brother',
            value: 'brother'
        },
        {
            label: 'Sister',
            value: 'sister'
        },
        {
            label: 'Guardian',
            value: 'guardian'
        },
        {
            label: 'Friend',
            value: 'friend'
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
        changes['selectedContact'] &&
        this.emergencyContactForm &&
        this.countries.length
    ) {
        this.setContactData();
    }
}

    createForm(): void {
        this.emergencyContactForm = this.fb.group({
            firstName: [
                '',
                Validators.required
            ],
            lastName: [
                '',
                Validators.required
            ],
            relationship: [
                '',
                Validators.required
            ],
            countryId: [
                '',
                Validators.required
            ],
            phoneNumber: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]{7,15}$/)
                ]
            ],
            email: [
                '',
                Validators.email
            ],
            address1: [
                ''
            ],
            address2: [
                ''
            ],
            state: [
                ''
            ],
            city: [
                ''
            ],
            pincode: [
                '',
                Validators.pattern(/^[0-9]{4,10}$/)
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
                this.setContactData();
            },
            error: (err) => {
                console.error(
                    'Country API Error:',
                    err
                );
                this.countries = [];
                this.loadingCountries = false;
                this.toastr.error(
                    'Failed to load countries'
                );
            }
        });
    }

    setContactData(): void {
        if (!this.selectedContact) {
            return;
        }

        const countryId = Number(
            this.selectedContact.CountryID ??
            this.selectedContact.countryId
        );

        this.emergencyContactForm.patchValue({
            firstName:
                this.selectedContact.FirstName ??
                this.selectedContact.firstName ??
                '',
            lastName:
                this.selectedContact.LastName ??
                this.selectedContact.lastName ??
                '',
            relationship:
                this.selectedContact.Relationship ??
                this.selectedContact.relationship ??
                '',
            countryId,
            phoneNumber:
                this.selectedContact.Phone ??
                this.selectedContact.phoneNumber ??
                '',
            email:
                this.selectedContact.Email ??
                this.selectedContact.email ??
                '',
            address1:
                this.selectedContact.Address1 ??
                this.selectedContact.address1 ??
                '',
            address2:
                this.selectedContact.Address2 ??
                this.selectedContact.address2 ??
                '',
            state:
                this.selectedContact.State ??
                this.selectedContact.state ??
                '',
            city:
                this.selectedContact.City ??
                this.selectedContact.city ??
                '',
            pincode:
                this.selectedContact.PostalCode ??
                this.selectedContact.pincode ??
                ''
        });

        if (countryId) {
            this.onCountryChange(countryId);
        }
    }

    onCountryChange(countryId: number): void {
        this.selectedCountry =
            this.countries.find(
                (c) => c.CountryID === countryId
            ) ?? null;

        const phoneControl =
            this.emergencyContactForm.get(
                'phoneNumber'
            );

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

    submit(): void {
        if (this.emergencyContactForm.invalid) {
            this.emergencyContactForm.markAllAsTouched();
            return;
        }

        const userId = sessionStorage.getItem('id');

        if (!userId) {
            this.toastr.error('Patient ID not found');
            return;
        }

        const contactId =
            this.selectedContact?.id ??
            this.selectedContact?.ID ??
            this.selectedContact?.ContactID;

        if (!contactId) {
            this.toastr.error(
                'Emergency contact ID not found'
            );
            return;
        }

        this.submitting = true;

        const formValue =
            this.emergencyContactForm.value;

        const contactData = {
            FirstName: formValue.firstName,
            LastName: formValue.lastName,
            Phone: formValue.phoneNumber,
            Email: formValue.email,
            CountryID: formValue.countryId,
            Relationship: formValue.relationship,
            Address1: formValue.address1,
            Address2: formValue.address2,
            City: formValue.city,
            State: formValue.state,
            PostalCode: formValue.pincode
        };

        const tv: tags[] = [
            {
                T: 'dk1',
                V: String(contactId)
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c1',
                V: JSON.stringify(contactData)
            },
            {
                T: 'c10',
                V: '2'
            }
        ];

        this.srv.getdata(
            'patientcontact',
            tv
        ).subscribe({
            next: (r) => {
                this.submitting = false;

                if (r?.Status === 1) {
                    const successMessage =
                        r.Data?.[0]?.[0]?.msg ??
                        'Emergency contact updated successfully';

                    this.toastr.success(
                        successMessage
                    );
                    this.saved.emit();
                    return;
                }
               this.submitting = false;
               this.cdr.detectChanges();
                const errorMessage =
                    r.Info ||
                    'Failed to update emergency contact';

                this.toastr.error(
                    errorMessage
                );
            },
            error: (err) => {
                console.error(
                    'Edit Emergency Contact API Error:',
                    err
                );

                this.submitting = false;
                this.cdr.detectChanges();
                this.toastr.error(
                    err?.Message ||
                    err?.error?.Info ||
                    'Something went wrong while updating emergency contact'
                );
            }
        });
    }
}