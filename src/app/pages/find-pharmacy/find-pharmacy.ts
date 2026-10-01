import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GHOService } from '../../services/gho.service';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../models/gho-model';

@Component({
    selector: 'find-pharmacy',
    standalone: true,
    imports: [
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './find-pharmacy.html',
})
export class FindPharmacy implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    pharmacyList: any[] = [];

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getPharmacyList();
    }

    getPharmacyList(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: '0'
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv.getdata(
            'findpharmacy',
            tv
        ).subscribe({
            next: (r) => {
                this.pharmacyList = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Pharmacy API Error:',
                    err
                );
                this.pharmacyList = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}