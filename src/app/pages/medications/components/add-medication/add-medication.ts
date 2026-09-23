import {
    Component,
    EventEmitter,
    Output,
    inject
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { GHOService } from '../../../../services/gho.service';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../models/gho-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-medication',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-medication.html',
    styleUrl: './add-medication.css'
})
export class AddMedication {

    private fb = inject(FormBuilder);

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    private toastr = inject(ToastrService);
    @Output() saved = new EventEmitter<void>();

    isLoading = false;

    tv: tags[] = [];

    res: ghoresult = new ghoresult();


    medicationForm = this.fb.group({

        medicationName: [
            '',
            Validators.required
        ],

        startDate: [
            null as Date | null,
            Validators.required
        ],

        endDate: [
            null as Date | null,
            Validators.required
        ],

        frequency: this.fb.control<string[]>(
            [],
            Validators.required
        )

    });


    frequencyOptions = [
        'Morning',
        'Afternoon',
        'Evening',
        'Night'
    ];


    toggleFrequency(option: string): void {

        const current =
            this.medicationForm.controls.frequency.value ?? [];

        if (current.includes(option)) {

            this.medicationForm.controls.frequency.setValue(
                current.filter(item => item !== option)
            );

        } else {

            this.medicationForm.controls.frequency.setValue([
                ...current,
                option
            ]);

        }

        this.medicationForm.controls.frequency.markAsTouched();
    }


    isFrequencySelected(option: string): boolean {

        return (
            this.medicationForm.controls.frequency.value
                ?.includes(option) ?? false
        );

    }

    formatDate(dateValue: Date | null): string {
        if (!dateValue) {
            return '';
        }

        if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
            return '';
        }
        return dateValue.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    }


    submit(): void {

        if (this.medicationForm.invalid) {

            this.medicationForm.markAllAsTouched();

            return;
        }


        const userId =
            sessionStorage.getItem('id');


        if (!userId) {

            console.error(
                'User ID not found in session storage'
            );

            this.toastr.error(
                'User ID not found'
            );

            return;
        }


        const formData =
            this.medicationForm.getRawValue();

        const startDate =
            this.formatDate(
                formData.startDate
            );


        const endDate =
            this.formatDate(
                formData.endDate
            );
        const frequency =
            (formData.frequency ?? []).join(',');
        const tv: tags[] = [

            {
                T: 'dk1',
                V: ' '
            },

            {
                T: 'dk2',
                V: userId
            },

            {
                T: 'c1',
                V: formData.medicationName ?? ''
            },

            {
                T: 'c2',
                V: startDate
            },

            {
                T: 'c3',
                V: endDate
            },

            {
                T: 'c4',
                V: frequency
            },

            {
                T: 'c10',
                V: '1'
            }

        ];
        this.isLoading = true;
        this.srv
            .getdata(
                'patientmedication',
                tv
            )
            .subscribe({
                next: (r) => {
                    this.isLoading = false;
                    if (r.Status === 1) {
                        const successMessage =
                            r.Data?.[0]?.[0]?.msg ??
                            'Medication added successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.medicationForm.reset({
                            medicationName: '',
                            startDate: null,
                            endDate: null,
                            frequency: []

                        });


                        this.saved.emit();

                        return;
                    }
                    const errorMessage =
                        r.Info ||
                        'Failed to add medication';
                    this.toastr.error(
                        errorMessage
                    );

                },


                error: (err) => {

                    console.error(
                        'Medication API Error:',
                        err
                    );
                    this.isLoading = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while adding medication'
                    );

                }

            });

    }

}