import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';

import { SheetComponent } from '../../../../components/sheet/sheet-component';
import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';
import { GHOUtitity } from '../../../../services/utilities';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyMessageComponent } from '../../../../components/empty-message/empty-message';

@Component({
    selector: 'prescription-section',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        EmptyMessageComponent

    ],
    templateUrl: './prescription-section.html',
    styleUrl: './prescription-section.css'
})
export class PrescriptionSection implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    loading = false;
    prescriptions: any[] = [];
    isSheetOpen = false;

    constructor(private cdr: ChangeDetectorRef) { }

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
                T: 'c10',
                V: '6'
            }
        ];

        this.srv.getdata('prescriptiondtl', tv).subscribe({
            next: (r) => {
                this.prescriptions = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },

            error: (err) => {
                console.error('Medication API Error:', err);
                this.prescriptions = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
    openPrescription(prescription: any): void {

    }




}