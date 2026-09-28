import {
    Component,
    Inject
} from '@angular/core';

import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrService } from 'ngx-toastr';

import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';


export interface BookingConfirmationData {

    distance: string;

    duration: string;

    amount: number;

    patientId: string;

    bookingData: {
        PatientName: string;
        CountryID: string;
        ContactNumber: string;

        StartAddress: string;
        StartLongitude: string;
        StartLatitude: string;

        EndAddress: string;
        EndLongitude: string;
        EndLatitude: string;
    };

}


@Component({
    selector: 'app-ambulance-confirmation-dialog',

    standalone: true,

    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],

    templateUrl:
        './booking-confirmation-dialog.html',

    styleUrl:
        './booking-confirmation-dialog.css'
})
export class BookingConfirmationDialog {

    loading = false;

    constructor(
        private dialogRef:
            MatDialogRef<BookingConfirmationDialog>,

        @Inject(MAT_DIALOG_DATA)
        public data: BookingConfirmationData,

        private srv: GHOService,

        private toastr: ToastrService
    ) { }


    cancel(): void {

        if (this.loading) {
            return;
        }

        this.dialogRef.close(false);

    }


    confirm(): void {

        if (this.loading) {
            return;
        }

        this.loading = true;


        const tv: tags[] = [

            {
                T: 'dk1',
                V: this.data.patientId
            },

            {
                T: 'c1',
                V: JSON.stringify(
                    this.data.bookingData
                )
            },

            {
                T: 'c10',
                V: '1'
            }

        ];



        this.srv
            .getdata(
                'ambulance',
                tv
            )
            .subscribe({

                next: (response) => {


                    if (
                        response?.Status === 1
                    ) {

                        this.toastr.success(
                            response
                                ?.Data?.[0]?.[0]?.msg ||
                            'Ambulance booked successfully'
                        );


                        // Close ONLY after API success
                        this.dialogRef.close(true);

                    }
                    else {

                        this.loading = false;

                        this.toastr.error(
                            response?.Info ||
                            response?.Error ||
                            'Unable to book ambulance'
                        );

                    }

                },


                error: (error) => {
                    console.error(
                        'Book Ambulance API Error:',
                        error
                    );
                    this.loading = false;
                    this.toastr.error(
                        'Unable to book ambulance'
                    );
                }
            });
    }
}
