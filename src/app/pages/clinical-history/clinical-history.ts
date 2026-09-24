import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrService } from 'ngx-toastr';
import { SheetComponent } from '../../components/sheet/sheet-component';
import { EmptyMessageComponent } from '../../components/empty-message/empty-message';
import { GHOService } from '../../services/gho.service';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../models/gho-model';
import { BannerComponent } from './components/banner/banner';




@Component({
    selector: 'clinical-history',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        BannerComponent,
        // AddEmergencyContact,
        // EditEmergencyContact,
        EmptyMessageComponent
    ],
    templateUrl: './Clinical-History.html',
    styleUrl: './clinical-history.css'
})
export class ClinicalHistory implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    clinicalHistory: any[] = [];
    isSheetOpen = false;
    isEditMode = false;
    selectedContact: any = null;
    expandedVisitSummaries = new Set<number>();
    private toastr = inject(ToastrService);

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getClinicalHistory();
    }


    getClinicalHistory(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: ''
            },
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c10',
                V: '4'
            }
        ];
        this.srv.getdata(
            'medicalfacilities',
            tv
        ).subscribe({
            next: (r) => {
                this.clinicalHistory = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.clinicalHistory = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

    }


    openAddSheet(): void {
        this.isEditMode = false;
        this.selectedContact = null;
        this.isSheetOpen = true;
    }


    openEditSheet(contact: any): void {
        this.selectedContact = contact;
        this.isEditMode = true;
        this.isSheetOpen = true;

    }


    closeSheet(): void {
        this.isSheetOpen = false;
        this.selectedContact = null;
        this.isEditMode = false;
    }


    contactSaved(): void {
        this.closeSheet();
        this.isEditMode = false;
        this.selectedContact = null;
        this.getClinicalHistory();
    }

    toggleVisitSummary(id: number): void {
        if (this.expandedVisitSummaries.has(id)) {
            this.expandedVisitSummaries.delete(id);
        } else {
            this.expandedVisitSummaries.add(id);
        }
    }

    isVisitSummaryExpanded(id: number): boolean {
        return this.expandedVisitSummaries.has(id);
    }


    deleteFacilitator(history: any): void {
        const userId =
            sessionStorage.getItem('id');
        if (!userId) {
            console.error(
                'User ID not found'
            );
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: history?.ID
            },
            {
                T: 'c10',
                V: '3'
            }

        ];
        this.srv.getdata(
            'medicalfacilities',
            tv
        ).subscribe({
            next: (r) => {
                this.getClinicalHistory();
                this.cdr.detectChanges();
                this.toastr.success(
                    'Facilitator deleted successfully'
                );
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.loading = false;
                this.cdr.detectChanges();
                this.toastr.error(
                    'Failed to delete facilitator'
                );
            }
        });
    }
}