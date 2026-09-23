
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';
import { GHOUtitity } from '../../../../services/utilities';
import { CustomCalendarComponent } from '../../../../components/custom-calendar/custom-calendar';
import { ToastrService } from 'ngx-toastr';


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
    CustomCalendarComponent
  ],
  templateUrl: './add-vitals.html',
  styleUrl: './add-vitals.css',
})
export class AddVitalsComponent implements OnInit, OnChanges {

  @Input() editData: any = null;

  @Input() date: Date | null = null;


  @Output() resetEdit = new EventEmitter<void>();
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  isLoading = false;
  private cdr = inject(ChangeDetectorRef);

  vitalsForm: FormGroup;
  selectedDateText: string = '';
  private toastr = inject(ToastrService);
  selectedDate: Date = new Date();


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
    }

  ];


  constructor(
    private fb: FormBuilder
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
      height: ['']

    });

  }


  ngOnInit(): void {
    if (this.date) {
      this.selectedDate = new Date(this.date);
    } else {
      this.selectedDate = new Date();
    }

    this.selectedDateText =
      this.formatCalendarDate(this.selectedDate);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['date'] &&
      changes['date'].currentValue
    ) {
      this.selectedDate =
        new Date(changes['date'].currentValue);
      this.selectedDateText =
        this.formatCalendarDate(this.selectedDate);
    }

  }

  onDateSelected(date: string): void {
    this.selectedDateText = date;
  }


  private getNumberValue(
    value: any
  ): number | null {

    if (
      value === '' ||
      value === null ||
      value === undefined
    ) {
      return null;
    }
    return Number(value);
  }



  submit(): void {
    if (this.vitalsForm.invalid) {
      this.vitalsForm.markAllAsTouched();
      return;
    }
    const userId =
      sessionStorage.getItem('id');
    if (!userId) {
      console.error(
        'Patient ID not found'
      );
      return;

    }


    if (!this.selectedDateText) {
      console.error(
        'Vitals date not selected'
      );
      return;
    }
    this.isLoading = true;
    const formValue =
      this.vitalsForm.value;
    const vitalsData: any = {

      HeartRate:
        this.getNumberValue(
          formValue.heartRate
        ),

      Systolic:
        this.getNumberValue(
          formValue.systolic
        ),

      Diastolic:
        this.getNumberValue(
          formValue.diastolic
        ),

      RespiratoryRate:
        this.getNumberValue(
          formValue.respiratoryRate
        ),

      BodyTemperature:
        this.getNumberValue(
          formValue.bodyTemperature
        ),

      OxygenSaturation:
        this.getNumberValue(
          formValue.oxygenSaturation
        ),

      BloodGlucose:
        this.getNumberValue(
          formValue.bloodGlucose
        ),

      PatientWeight:
        this.getNumberValue(
          formValue.weight
        ),

      Height:
        this.getNumberValue(
          formValue.height
        ),
      CreatedAt:
        this.formatDateForApi(
          this.selectedDateText
        ),

      Source: 'PRx'

    };

    Object.keys(vitalsData).forEach(
      (key) => {
        if (
          vitalsData[key] === '' ||
          vitalsData[key] === null ||
          vitalsData[key] === undefined
        ) {
          delete vitalsData[key];
        }

      }
    );
    const tv: tags[] = [
      {
        T: 'dk2',
        V: userId
      },
      {
        T: 'c1',
        V: JSON.stringify(
          vitalsData
        )
      },
      {
        T: 'c10',
        V: '1'
      }

    ];
    this.srv
      .getdata(
        'patientvital',
        tv
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.cdr.detectChanges();
          if (response?.Status === 0) {
            const infoMessage =
              response?.Info ||
              'Unable to add vitals';
            this.toastr.error(infoMessage);
            return;
          }
          if (response?.Status === 1) {
            const successMessage =
              response?.Data?.[0]?.[0]?.Msg ||
              'Vitals added successfully';
            this.toastr.success(successMessage);
            this.vitalsForm.reset();
            if (this.editData) {
              this.resetEdit.emit();
            }

            return;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
          this.toastr.error(
            response?.Info ||
            response?.Error ||
            'Something went wrong'
          );
        },

        error: (error) => {
          console.error(
            'Add Vitals API Error:',
            error
          );

          this.isLoading = false;
          this.cdr.detectChanges();
          this.toastr.error(
            error?.error?.Info ||
            error?.error?.Error ||
            'Something went wrong while adding vitals'
          );
        }

      });

  }


  cancelEdit(): void {
    this.vitalsForm.reset();
    this.resetEdit.emit();
  }

  private formatCalendarDate(
    date: Date
  ): string {

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const year =
      date.getFullYear();
    return `${day}/${month}/${year}`;

  }


  private formatDateForApi(date: string): string {
    if (!date) {
      return '';
    }
    const parts = date.split('/');
    if (parts.length !== 3) {
      return '';
    }
    const [day, month, year] = parts;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

}

