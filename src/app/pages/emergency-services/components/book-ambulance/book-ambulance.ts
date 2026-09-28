import {
    ChangeDetectorRef,
    Component,
    OnInit,
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
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
    MatDialog,
    MatDialogModule
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';

import {
    LocationSelectorComponent,
    LocationResult
} from '../../../../components/location-selector/location-selector';

import { AmbulanceService } from '../../services/ambulance-service';

import {
    BookingConfirmationData,
    BookingConfirmationDialog
} from '../booking-confirmation-dialog/booking-confirmation-dialog';

interface Country {
    CountryID: number;
    CountryName: string;
    CountryCode: string;
    MinLength: number;
    MaxLength: number;
}

@Component({
    selector: 'app-book-ambulance',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ],
    templateUrl: './book-ambulance.html',
    styleUrl: './book-ambulance.css'
})
export class BookAmbulance implements OnInit {
    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private ambulanceService = inject(AmbulanceService);
    private toastr = inject(ToastrService);
    private cdr = inject(ChangeDetectorRef);
    private dialog = inject(MatDialog);

    ambulanceForm!: FormGroup;
    countries: Country[] = [];
    loadingCountries = false;
    submitting = false;
    selectedCountry: Country | null = null;
    patientId = '';

    ngOnInit(): void {
        this.patientId = sessionStorage.getItem('id') ?? '';
        this.createForm();
        this.getCountryList();
    }

    createForm(): void {
        this.ambulanceForm = this.fb.group({
            patientName: [
                '',
                Validators.required
            ],
            countryId: [
                '',
                Validators.required
            ],
            phone: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[0-9]+$/)
                ]
            ],
            pickupAddress: [
                '',
                Validators.required
            ],
            destinationAddress: [
                '',
                Validators.required
            ],
            pickupLatitude: [null],
            pickupLongitude: [null],
            destinationLatitude: [null],
            destinationLongitude: [null]
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

        this.srv
            .getdata('lists', tv)
            .subscribe({
                next: (r) => {
                    this.countries = r.Data?.[0] ?? [];
                    this.loadingCountries = false;
                    this.cdr.detectChanges();
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

                    this.cdr.detectChanges();
                }
            });
    }

    onCountryChange(countryId: number): void {
        this.selectedCountry =
            this.countries.find(
                country =>
                    country.CountryID === countryId
            ) ?? null;
        const phoneControl =
            this.ambulanceForm.get('phone');

        if (
            !phoneControl ||
            !this.selectedCountry
        ) {
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

    selectPickupLocation(): void {
        const dialogRef = this.dialog.open(
            LocationSelectorComponent,
            {
                width: '600px',
                maxWidth: '95vw',
                height: '80vh',
                maxHeight: '90vh',
                panelClass:
                    'location-selector-dialog',
                data: {
                    patientId: this.patientId,
                    initialAddress:
                        this.ambulanceForm
                            .get('pickupAddress')
                            ?.value ?? '',
                    showSavedAddresses: true,
                    allowCurrentLocation: true
                }
            }
        );

        dialogRef
            .afterClosed()
            .subscribe(
                (
                    location:
                        LocationResult | undefined
                ) => {
                    if (!location) {
                        return;
                    }

                    const address =
                        location.fullAddress ||
                        location.formattedAddress ||
                        '';

                    this.ambulanceForm.patchValue({
                        pickupAddress: address,
                        pickupLatitude:
                            location.latitude ?? null,
                        pickupLongitude:
                            location.longitude ?? null
                    });
                    this.cdr.detectChanges();
                }
            );
    }

    selectDestinationLocation(): void {
        const dialogRef = this.dialog.open(
            LocationSelectorComponent,
            {
                width: '600px',
                maxWidth: '95vw',
                height: '80vh',
                maxHeight: '90vh',
                panelClass:
                    'location-selector-dialog',
                data: {
                    patientId: this.patientId,
                    initialAddress:
                        this.ambulanceForm
                            .get('destinationAddress')
                            ?.value ?? '',
                    showSavedAddresses: true,
                    allowCurrentLocation: true
                }
            }
        );

        dialogRef
            .afterClosed()
            .subscribe(
                (
                    location:
                        LocationResult | undefined
                ) => {
                    if (!location) {
                        return;
                    }
                    const address =
                        location.fullAddress ||
                        location.formattedAddress ||
                        '';
                    this.ambulanceForm.patchValue({
                        destinationAddress: address,
                        destinationLatitude:
                            location.latitude ?? null,
                        destinationLongitude:
                            location.longitude ?? null
                    });
                    this.cdr.detectChanges();
                }
            );
    }

    submit(): void {
        if (this.ambulanceForm.invalid) {
            this.ambulanceForm.markAllAsTouched();
            return;
        }
        const formValue =
            this.ambulanceForm.value;
        const pickupLatitude =
            formValue.pickupLatitude;
        const pickupLongitude =
            formValue.pickupLongitude;
        const destinationLatitude =
            formValue.destinationLatitude;
        const destinationLongitude =
            formValue.destinationLongitude;

        if (
            pickupLatitude == null ||
            pickupLongitude == null ||
            destinationLatitude == null ||
            destinationLongitude == null
        ) {
            this.toastr.error(
                'Please select pickup and destination locations'
            );

            return;
        }
        const bookingData = {
            PatientName:formValue.patientName,
            CountryID:formValue.countryId?.toString(),
            ContactNumber:formValue.phone,
            StartAddress:formValue.pickupAddress,
            StartLongitude:String(formValue.pickupLongitude),
            StartLatitude:String(formValue.pickupLatitude),
            EndAddress:formValue.destinationAddress,
            EndLongitude:String(formValue.destinationLongitude),
            EndLatitude:String(formValue.destinationLatitude)
        };

        this.submitting = true;

        this.ambulanceService
            .calculateDistance({
                originLatitude:
                    Number(pickupLatitude),

                originLongitude:
                    Number(pickupLongitude),

                destinationLatitude:
                    Number(destinationLatitude),

                destinationLongitude:
                    Number(destinationLongitude)
            })
            .subscribe({
                next: (distanceResponse) => {
                    const distanceKm =
                        Number(
                            distanceResponse.DistanceKm
                        );
                    const durationSeconds =
                        Number(
                            distanceResponse.DurationSeconds
                        );
                    const durationMinutes =
                        Math.ceil(
                            durationSeconds / 60
                        );
                    const tv: tags[] = [
                        {
                            T: 'dk1',
                            V: this.patientId
                        },
                        {
                            T: 'dk2',
                            V: '0'
                        },
                        {
                            T: 'c1',
                            V: distanceKm.toString()
                        },
                        {
                            T: 'c2',
                            V: durationMinutes.toString()
                        },
                        {
                            T: 'c10',
                            V: '8'
                        }
                    ];

                    this.srv
                        .getdata(
                            'ambulance',
                            tv
                        )
                        .subscribe({
                            next: (amountResponse) => {
                                const amountData =
                                    amountResponse
                                        .Data?.[0]?.[0];
                                if (!amountData) {
                                    this.submitting = false;
                                    this.cdr.detectChanges();
                                    this.toastr.error(
                                        'Unable to calculate ambulance amount'
                                    );

                                    return;
                                }
                                const amount =
                                    Number(
                                        amountData.Amount
                                    );
                                this.submitting = false;
                                this.cdr.detectChanges();
                                const dialogRef =
                                    this.dialog.open(
                                        BookingConfirmationDialog,
                                        {
                                            width: '500px',
                                            maxWidth: '95vw',
                                            disableClose: true,
                                            data: {
                                                distance: distanceResponse.DistanceText,
                                                duration:distanceResponse.DurationText,
                                                amount,
                                                patientId:this.patientId,
                                                bookingData
                                            } as BookingConfirmationData
                                        }
                                    );

                                dialogRef
                                    .afterClosed()
                                    .subscribe(
                                        (
                                            confirmed:
                                                boolean
                                        ) => {
                                            if (
                                                confirmed
                                            ) {
                                                this.ambulanceForm.reset();
                                                this.selectedCountry =
                                                    null;
                                            }
                                        }
                                    );
                            },
                            error: (error) => {
                                console.error(
                                    'Ambulance Amount API Error:',
                                    error
                                );
                                this.submitting = false;
                                this.cdr.detectChanges();
                                this.toastr.error(
                                    'Unable to calculate ambulance amount'
                                );
                            }
                        });
                },
                error: (error) => {
                    console.error(
                        'Distance API Error:',
                        error
                    );
                    this.submitting = false;
                    this.cdr.detectChanges();
                    this.toastr.error(
                        'Unable to calculate driving distance'
                    );
                }
            });
    }
}
