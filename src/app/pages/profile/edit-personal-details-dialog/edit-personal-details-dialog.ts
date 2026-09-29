import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { formatDateForInput, formatDateToMMDDYYYYFromDate } from '../../../utils/date';
import { GHOService } from '../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-personal-details-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './edit-personal-details-dialog.html',
})
export class EditPersonalDetailsDialog implements OnChanges {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  @Input() open = false;
  @Input() details: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  isLoading = false;

  form = this.fb.group({
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    BirthDate: [''],
    Gender: [''],
    Phone: [''],
    Email: ['', Validators.email],
    BloodGroup: [''],
    MaritalStatus: [''],
    Occupation: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['open']?.currentValue === true ||
      changes['details']
    ) {
      if (this.open && this.details) {
        this.form.patchValue({
          FirstName: this.details.FirstName ?? '',
          LastName: this.details.LastName ?? '',
          BirthDate: formatDateForInput(
            this.details.BirthDate
          ),
          Gender: this.getGenderValue(this.details.Gender),
          Phone: this.details.Phone ?? '',
          Email: this.details.Email ?? '',
          BloodGroup: this.details.BloodGroup ?? '',
          MaritalStatus: this.details.MaritalStatus ?? '',
          Occupation: this.details.Occupation ?? '',
        });
      }
    }
  }
  private getGenderName(gender: string | null): string {
    switch (gender) {
      case 'M':
        return 'Male';

      case 'F':
        return 'Female';

      default:
        return gender ?? '';
    }
  }
  private getGenderValue(gender: string | null): string {
    if (gender === 'Male') {
      return 'M';
    }
    if (gender === 'Female') {
      return 'F';
    }
    return gender ?? '';
  }
  close(): void {
    if (this.isLoading) {
      return;
    }
    this.openChange.emit(false);
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const tv = [
      {
        T: 'dk1',
        V: this.details?.id ?? '',
      },
      {
        T: 'c1',
        V: JSON.stringify({
          FirstName:
            formValue.FirstName ||
            this.details?.FirstName ||
            '',
          LastName:
            formValue.LastName ||
            this.details?.LastName ||
            '',
          BirthDate: formValue.BirthDate
            ? formatDateToMMDDYYYYFromDate(
              new Date(formValue.BirthDate)
            )
            : this.details?.BirthDate || '',
          Gender:
            formValue.Gender
              ? this.getGenderName(formValue.Gender)
              : this.details?.Gender || '',
          Phone:
            formValue.Phone ||
            this.details?.Phone ||
            '',
          Email:
            formValue.Email ||
            this.details?.Email ||
            '',
          BloodGroup:
            formValue.BloodGroup ||
            this.details?.BloodGroup ||
            '',
          MaritalStatus:
            formValue.MaritalStatus ||
            this.details?.MaritalStatus ||
            '',
          Occupation:
            formValue.Occupation ||
            this.details?.Occupation ||
            '',
        }),
      },
      {
        T: 'c10',
        V: '2',
      },
    ];

    this.srv.getdata('patient', tv).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.Status === 1) {
          this.toastr.success(res?.Data[0][0]?.msg)
          this.close();
        } else {
          this.toastr.error(res?.Info)
        }
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
    this.isLoading = true;
  }
}