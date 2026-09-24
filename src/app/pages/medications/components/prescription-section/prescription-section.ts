import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';
import { GHOUtitity } from '../../../../services/utilities';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
    MatDialog,
    MatDialogModule
} from '@angular/material/dialog';
import { EmptyMessageComponent } from '../../../../components/empty-message/empty-message';
import { PrescriptionDetails } from '../prescription-details/prescription-details';


@Component({
    selector: 'prescription-section',
    standalone: true,
    imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        EmptyMessageComponent,
        
    ],
    templateUrl: './prescription-section.html',
    styleUrl: './prescription-section.css'
})
export class PrescriptionSection implements OnInit {
    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    dialog = inject(MatDialog);
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    loading = false;
    prescriptions: any[] = [];
    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getUserPrescriptions();
    }

    getUserPrescriptions(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: userId
            },
            {
                T: 'c2',
                V: '7'
            },
            {
                T: 'c10',
                V: '16'
            }
        ];

        this.srv.getdata('dworder', tv).subscribe({
            next: (r) => {
                try {
                    const prescriptionString =
                        r.Data?.[0]?.[0]?.o;
                    if (prescriptionString) {
                        this.prescriptions =
                            JSON.parse(prescriptionString);
                    } else {
                        this.prescriptions = [];
                    }

                } catch (error) {
                    console.error(
                        'Prescription JSON parse error:',
                        error
                    );

                    this.prescriptions = [];
                }
                this.loading = false;
                this.cdr.detectChanges();
            },

            error: (err) => {
                console.error(
                    'Prescription API Error:',
                    err
                );
                this.prescriptions = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    openPrescription(prescription: any): void {
        this.dialog.open(PrescriptionDetails, {
            width: '600px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            data: prescription,
            panelClass: 'prescription-dialog'
        });

    }
}