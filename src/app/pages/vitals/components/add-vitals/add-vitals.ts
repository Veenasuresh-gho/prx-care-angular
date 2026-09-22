import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface VitalField {
  name: string;
  label: string;
  placeholder: string;
  unit: string;
  icon: string;
}

@Component({
  selector: 'app-add-vitals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-vitals.html',
  styleUrl: './add-vitals.css',
})
export class AddVitalsComponent implements OnChanges {

  @Input() editData: any = null;

  @Input() date: Date | null = null;

  @Input() patientId: number | string | null = null;

  @Output() refetch = new EventEmitter<void>();

  @Output() resetEdit = new EventEmitter<void>();


  isLoading = false;


  vitalsForm: FormGroup;


  vitalFields: VitalField[] = [
    {
      name: 'heartRate',
      label: 'Heart Rate',
      placeholder: 'Enter value',
      unit: 'bpm',
      icon: 'favorite',
    },
    {
      name: 'systolic',
      label: 'Systolic',
      placeholder: 'Enter value',
      unit: 'mmHg',
      icon: 'monitor_heart',
    },
    {
      name: 'diastolic',
      label: 'Diastolic',
      placeholder: 'Enter value',
      unit: 'mmHg',
      icon: 'monitor_heart',
    },
    {
      name: 'respiratoryRate',
      label: 'Respiratory Rate',
      placeholder: 'Enter value',
      unit: 'Breath/min',
      icon: 'air',
    },
    {
      name: 'bodyTemperature',
      label: 'Body Temperature',
      placeholder: 'Enter value',
      unit: '°F',
      icon: 'device_thermostat',
    },
    {
      name: 'oxygenSaturation',
      label: 'Oxygen Saturation',
      placeholder: 'Enter value',
      unit: '%',
      icon: 'water_drop',
    },
    {
      name: 'bloodGlucose',
      label: 'Blood Glucose',
      placeholder: 'Enter value',
      unit: 'mg/dL',
      icon: 'bloodtype',
    },
    {
      name: 'weight',
      label: 'Weight',
      placeholder: 'Enter value',
      unit: 'kg',
      icon: 'monitor_weight',
    },
    {
      name: 'height',
      label: 'Height',
      placeholder: 'Enter value',
      unit: 'cm',
      icon: 'height',
    },
  ];


  constructor(
    private fb: FormBuilder,
  ) {
    this.vitalsForm = this.fb.group({
      heartRate: [''],
      systolic: [''],
      diastolic: [''],
      respiratoryRate: [''],
      bodyTemperature: [''],
      oxygenSaturation: [''],
      bloodGlucose: [''],
      weight: [''],
      height: [''],
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['editData']) {

      if (this.editData) {
        this.setEditData();
      } else {
        this.vitalsForm.reset();
      }

    }

  }


  private setEditData(): void {

    this.vitalsForm.patchValue({
      heartRate: this.editData?.heartRate ?? '',
      systolic: this.editData?.systolic ?? '',
      diastolic: this.editData?.diastolic ?? '',
      respiratoryRate: this.editData?.respiratoryRate ?? '',
      bodyTemperature: this.editData?.bodyTemperature ?? '',
      oxygenSaturation: this.editData?.oxygenSaturation ?? '',
      bloodGlucose: this.editData?.bloodGlucose ?? '',
      weight: this.editData?.weight ?? '',
      height: this.editData?.height ?? '',
    });

  }


  submit(): void {

    if (this.vitalsForm.invalid) {
      this.vitalsForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.vitalsForm.value;

    const payload: any = {
      patientId: this.patientId,
      date: this.formatDate(this.date),
    };


    Object.keys(formValue).forEach((key) => {

      const value = formValue[key];

      if (
        value !== '' &&
        value !== null &&
        value !== undefined
      ) {
        payload[key] = Number(value);
      }

    });


    console.log('Vitals payload:', payload);


    /*
     * ADD API
     *
     * this.vitalsService.addVitals(payload).subscribe({
     *
     *   next: (response) => {
     *
     *      this.isLoading = false;
     *
     *      this.refetch.emit();
     *
     *      this.vitalsForm.reset();
     *   },
     *
     *   error: () => {
     *      this.isLoading = false;
     *   }
     *
     * });
     */


    /*
     * UPDATE API
     *
     * if (this.editData) {
     *
     *   const payload = {
     *      id: this.editData.id,
     *      ...payload
     *   };
     *
     *   this.vitalsService.updateVitals(payload)
     * }
     */


    // Temporary
    setTimeout(() => {

      this.isLoading = false;

      this.vitalsForm.reset();

      this.refetch.emit();

      if (this.editData) {
        this.resetEdit.emit();
      }

    }, 500);

  }


  cancelEdit(): void {

    this.vitalsForm.reset();

    this.resetEdit.emit();

  }


  private formatDate(date: Date | null): string {

    if (!date) {
      return '';
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

}