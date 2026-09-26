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
import { AddHealthInsurance } from './components/add-health-insurance/add-health-insurance';
import { EditHealthInsurance } from './components/edit-health-insurance/edit-health-insurance';


@Component({
    selector: 'health-insurance',
    standalone: true,
    imports: [
        SheetComponent,
        MatIconModule,
        MatProgressSpinnerModule,
        BannerComponent,
        AddHealthInsurance,
        EditHealthInsurance,
        EmptyMessageComponent
    ],
    templateUrl: './health-insurance.html',
    styleUrl: './health-insurance.css'
})
export class HealthInsurance implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    healthInsurance: any[] = [];
    isSheetOpen = false;
    isEditMode = false;
    selectedInsurance: any = null;
  
    private toastr = inject(ToastrService);

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getHealthInsurance();
    }


    getHealthInsurance(): void {
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
            'patientinsurance',
            tv
        ).subscribe({
            next: (r) => {
                this.healthInsurance = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Emergency Contact API Error:',
                    err
                );
                this.healthInsurance = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

    }

    openAddSheet(): void {
        this.isEditMode = false;
        this.selectedInsurance = null;
        this.isSheetOpen = true;
    }

    openEditSheet(contact: any): void {
        this.selectedInsurance = contact;
        this.isEditMode = true;
        this.isSheetOpen = true;

    }


    closeSheet(): void {
        this.isSheetOpen = false;
        this.selectedInsurance = null;
        this.isEditMode = false;
    }

    insuranceSaved(): void {
        this.closeSheet();
        this.isEditMode = false;
        this.selectedInsurance = null;
        this.getHealthInsurance();
    }


    deleteInsurance(insurance: any): void {
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
                V: insurance?.ID
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
            'patientinsurance',
            tv
        ).subscribe({
            next: (r) => {
                this.getHealthInsurance();
                this.cdr.detectChanges();
                this.toastr.success(
                    'Health Insurance deleted successfully'
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
                    'Failed to delete Health Insurance'
                );
            }
        });
    }
}