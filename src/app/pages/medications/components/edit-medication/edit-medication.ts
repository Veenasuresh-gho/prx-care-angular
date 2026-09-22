import {
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
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-medication',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './edit-medication.html',
    styleUrl: './edit-medication.css'
})
export class EditMedication implements OnChanges {

    private fb = inject(FormBuilder);
    private srv = inject(GHOService);
    private toastr = inject(ToastrService);
    @Input() medication: any = null;
    @Output() saved = new EventEmitter<void>();
    isLoading = false;

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


    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['medication'] &&
            this.medication
        ) {
            this.populateForm();
        }
    }


    populateForm(): void {
        const medication = this.medication;
        this.medicationForm.patchValue({
            medicationName:
                medication.MedicationName ?? '',
            startDate:
                this.convertToDate(
                    medication.StartDate
                ),
            endDate:
                this.convertToDate(
                    medication.EndDate
                ),
            frequency:
                this.parseFrequency(
                    medication.Frequency
                )
        });
    }


    parseFrequency(
        value: string | null | undefined
    ): string[] {

        if (!value) {
            return [];
        }

        return value
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);

    }


    convertToDate(
        value: string | null | undefined
    ): Date | null {

        if (!value) {
            return null;
        }

        const cleanedValue =
            value.replace(',', '');

        const parts =
            cleanedValue.split(' ');

        if (parts.length !== 3) {
            return null;
        }

        const day =
            Number(parts[0]);

        const monthName =
            parts[1];

        const year =
            Number(parts[2]);


        const months: Record<string, number> = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };


        const month =
            months[monthName];
        if (
            month === undefined ||
            isNaN(day) ||
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


    toggleFrequency(option: string): void {
        const current =
            this.medicationForm.controls.frequency.value ?? [];
        if (current.includes(option)) {

            this.medicationForm.controls.frequency.setValue(
                current.filter(
                    item => item !== option
                )
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

    formatDate(
        dateValue: Date | null
    ): string {

        if (!dateValue) {
            return '';
        }


        if (
            !(dateValue instanceof Date) ||
            isNaN(dateValue.getTime())
        ) {
            return '';
        }


        return dateValue.toLocaleDateString(
            'en-GB',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );

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
                'User ID not found'
            );
            this.toastr.error(
                'User ID not found'
            );

            return;
        }


        if (!this.medication) {
            console.error(
                'Medication data not found'
            );
            this.toastr.error(
                'Medication data not found'
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
                V: String(
                    this.medication.ID ?? ''
                )
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
                V: '2'
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
                            'Medication updated successfully';
                        this.toastr.success(
                            successMessage
                        );
                        this.saved.emit();
                        return;
                    }
                    const errorMessage =
                        r.Info ||
                        'Failed to update medication';
                    this.toastr.error(
                        errorMessage
                    );
                },
                error: (err) => {
                    console.error(
                        'Update Medication Error:',
                        err
                    );
                    this.isLoading = false;
                    this.toastr.error(
                        err?.Message ||
                        err?.error?.Info ||
                        'Something went wrong while updating medication'
                    );

                }

            });
    }

}