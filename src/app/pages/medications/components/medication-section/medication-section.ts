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
import { AddMedication } from '../add-medication/add-medication';
import { EditMedication } from '../edit-medication/edit-medication';
import { ToastrService } from 'ngx-toastr';
import { EmptyMessageComponent } from '../../../../components/empty-message/empty-message';
@Component({
    selector: 'medication-section',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        AddMedication,
        EditMedication,
        EmptyMessageComponent

    ],
    templateUrl: './medication-section.html',
    styleUrl: './medication-section.css'
})
export class MedicationSection implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    loading = false;
    medications: any[] = [];
    isSheetOpen = false;
    isEditMode = false;
    private toastr = inject(ToastrService);
    selectedMedication: any = null;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getUserMedications();
    }

    getUserMedications(): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk2',
                V: userId
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.srv.getdata('patientmedication', tv).subscribe({
            next: (r) => {
                this.medications = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },

            error: (err) => {
                console.error('Medication API Error:', err);
                this.medications = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }


    openAddSheet(): void {
        this.isEditMode = false;
        this.selectedMedication = null;
        this.isSheetOpen = true;
    }


    openEditSheet(medication: any): void {
        this.selectedMedication = medication;
        this.isEditMode = true;
        this.isSheetOpen = true;

    }

    closeSheet(): void {
        this.isSheetOpen = false;
        this.selectedMedication = null;
        this.isEditMode = false;
    }

    medicationSaved(): void {
        this.closeSheet();
        this.isEditMode = false;
        this.selectedMedication = null;
        this.getUserMedications();
    }

    deleteMedication(medication: any): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            console.error('User ID not found');
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: medication?.ID || ""
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

        this.srv.getdata('patientmedication', tv).subscribe({
            next: (r) => {
                this.medications = r.Data?.[0] ?? [];
                this.loading = false;
                this.getUserMedications()
                this.cdr.detectChanges();
                this.toastr.success(
                    'Medication deleted successfully'
                );
            },

            error: (err) => {
                console.error('Medication API Error:', err);
                this.loading = false;
                this.cdr.detectChanges();
                this.toastr.error(
                    'Failed to delete medication'
                );
            }
        });


    }

}