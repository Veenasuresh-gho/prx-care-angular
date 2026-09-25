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
import { AddAllergy } from './components/add-allergy/add-allergy';
import { EditAllergy } from './components/edit-allergy/edit-allergy';

@Component({
    selector: 'allergy',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        BannerComponent,
        AddAllergy,
        EditAllergy,
        EmptyMessageComponent
    ],
    templateUrl: './allergy.html',
    styleUrl: './allergy.css'
})
export class Allergy implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    patientAllergy: any[] = [];
    isSheetOpen = false;
    isEditMode = false;
    selectedAllergy: any = null;
    expandedVisitSummaries = new Set<number>();
    private toastr = inject(ToastrService);

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getPatientAllergys();
    }


    getPatientAllergys(): void {
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
                V: '3'
            }
        ];
        this.srv.getdata(
            'patientallergy',
            tv
        ).subscribe({
            next: (r) => {
                this.patientAllergy = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.patientAllergy = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

    }

    openAddSheet(): void {
        this.isEditMode = false;
        this.selectedAllergy = null;
        this.isSheetOpen = true;
    }

    openEditSheet(contact: any): void {
        this.selectedAllergy = contact;
        this.isEditMode = true;
        this.isSheetOpen = true;

    }


    closeSheet(): void {
        this.isSheetOpen = false;
        this.selectedAllergy = null;
        this.isEditMode = false;
    }

    allergySaved(): void {
        this.closeSheet();
        this.isEditMode = false;
        this.selectedAllergy = null;
        this.getPatientAllergys();
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


    deleteAllergy(allergy: any): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error(
                'User ID not found'
            );
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: allergy?.ID
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
            'patientallergy',
            tv
        ).subscribe({
            next: (r) => {
                this.getPatientAllergys();
                this.cdr.detectChanges();
                this.toastr.success(
                    'Allergy deleted successfully'
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
                    'Failed to delete allergy'
                );
            }
        });
    }
}