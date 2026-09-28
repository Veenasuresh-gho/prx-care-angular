import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';
import { formatDateToDDMMYYYY } from '../../../../../../utils/date';
import { FileUploadService } from '../../../../../../services/file-upload-service';
import { GHOService } from '../../../../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lab-collection-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    MatFormFieldModule,
    MatInputModule,
    CountrySelectField,
  ],
  templateUrl: './lab-collection-dialog.html',
})
export class LabCollectionDialog implements OnChanges, OnInit {

  private fb = inject(FormBuilder);
  private fileUploadService = inject(FileUploadService);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  patientId: string | null = null;
  file: File | null = null;

  form = this.fb.group({
    test: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    name: ['', Validators.required],
    countryId: ['91', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  isSubmitting = false;
  isCancelling = false;
  isFileUploading = false;

  view: 'form' | 'location' = 'form';

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.loadBooking();
    }

    if (changes['open'] && !this.open) {
      this.view = 'form';
    }
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      this.form.patchValue({
        test: this.booking?.tests || '',
        date: this.booking?.date || '',
        time: this.booking?.time || '',
        name: this.booking?.name || '',
        countryId:
          this.booking?.countryId ||
          this.booking?.countryCode ||
          '91',
        phone: this.booking?.contact || '',
        address: this.booking?.address || '',
      });
    } else {
      this.resetForm();
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  resetForm(): void {
    this.form.reset({
      test: '',
      date: '',
      time: '',
      name: '',
      countryId: '91',
      phone: '',
      address: '',
    });

    this.file = null;

    this.isSubmitting = false;
    this.isCancelling = false;
    this.isFileUploading = false;

    this.view = 'form';
  }

  onFileChange(file: File | null): void {
    this.file = file;
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    this.view = 'location';
  }

  handleLocationSelect(selectedAddress: string): void {
    this.form.controls.address.setValue(selectedAddress);
    this.form.controls.address.markAsTouched();

    this.view = 'form';
  }

  handleLocationBack(): void {
    this.view = 'form';
  }

  confirmBooking(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data = this.form.getRawValue();
    const formattedDate = data.date
      ? formatDateToDDMMYYYY(data.date)
      : '';

    const tags = [
      {
        T: 'dk1',
        V: this.patientId ?? '',
      },
      {
        T: 'dk2',
        V: formattedDate,
      },
      {
        T: 'c1',
        V: JSON.stringify({
          TestName: data.test ?? '',
          CollectionTime: data.time ?? '',
          PatientName: data.name ?? '',
          CountryId: data.countryId ?? '',
          ContactNumber: data.phone ?? '',
          Address: data.address ?? '',
        }),
      },
      {
        T: 'c8',
        V: '4',
      },
      {
        T: 'c10',
        V: '1',
      },
    ];
    this.srv.getdata('hcare_', tags).subscribe({
      next: async (res) => {
        if (res.Status !== 1) {
          this.isSubmitting = false;

          this.toastr.error(
            res?.Info || 'Unable to create pharmacy delivery request'
          );

          return;
        }

        const bookingId = res?.Data?.[0]?.[0]?.id;

        if (!bookingId) {
          this.isSubmitting = false;

          this.toastr.error(
            'Booking created, but booking ID was not returned'
          );

          return;
        }

        if (this.file) {
          const uploadSuccess =
            await this.fileUploadService.handleFileUpload(
              String(bookingId),
              this.patientId ?? '',
              this.file,
              '33'
            );

          if (!uploadSuccess) {
            this.isSubmitting = false;
            return;
          }
        }

        this.toastr.success(
          res?.Data?.[0]?.[0]?.msg ||
          'Pharmacy delivery request submitted successfully'
        );

        this.isSubmitting = false;
        this.close();
      },

      error: (error) => {
        console.error('Pharmacy booking error:', error);

        this.isSubmitting = false;

        this.toastr.error(
          'Unable to submit pharmacy delivery request'
        );
      },
    });

    this.isSubmitting = false;
  }

  cancelBooking(): void {
    if (!this.booking?.id || this.isCancelling) {
      return;
    }

    this.isCancelling = true;

    console.log(
      'Cancel Lab Collection Booking:',
      this.booking.id
    );

    this.isCancelling = false;
  }

  openExistingFile(): void {
    if (this.booking?.fileUrl) {
      window.open(this.booking.fileUrl, '_blank');
    }
  }
}