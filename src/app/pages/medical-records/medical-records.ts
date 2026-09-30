import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { GHOService } from '../../services/gho.service';
import { tags } from '../../models/gho-model';
import { SheetComponent } from '../../components/sheet/sheet-component';
import { AddMedicalRecord } from './components/add-medical-records/add-medical-record';
import { ToastrService } from 'ngx-toastr';
import { MedicalRecordsBannerComponent } from './components/banner/banner';

@Component({
    selector: 'app-medical-records',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        SheetComponent,
        AddMedicalRecord,
        MedicalRecordsBannerComponent
    ],
    templateUrl: './medical-records.html',
    styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit {
    private srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);
    private toastr = inject(ToastrService);
    selectedTab = 0;
    activeCategoryId = 2;
    fileList: any[] = [];
    isLoading = false;
    isSheetOpen = false;
    deletingRecordId: number | null = null;

    readonly tabContent = [
        {
            label: 'Prescriptions & Medications',
            value: 2,
            icon: 'medical-records/medicine.png',
            color: '#FFF0F0'
        },
        {
            label: 'Test Results & Reports',
            value: 1,
            icon: 'medical-records/test.png',
            color: '#FFEFF6'
        },
        {
            label: 'Hospital & Treatment Records',
            value: 3,
            icon: 'medical-records/medical-file.png',
            color: '#FFF7DA'
        },
        {
            label: 'Immunization & Preventive Care',
            value: 4,
            icon: 'medical-records/preventive-care.png',
            color: '#ECF6FF'
        }
    ];

    ngOnInit(): void {
        this.getFileList();
    }

    onTabChange(index: number): void {
        this.selectedTab = index;
        this.activeCategoryId = this.tabContent[index].value;
        this.getFileList();
    }

    getFileList(): void {
        const patientId = sessionStorage.getItem('id');
        if (!patientId) {
            this.fileList = [];
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
        }

        const tv: tags[] = [
            {
                T: 'dk1',
                V: ''
            },
            {
                T: 'dk2',
                V: patientId
            },
            {
                T: 'c1',
                V: this.activeCategoryId.toString()
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.isLoading = true;
        this.cdr.detectChanges();
        this.srv.getdata(
            'patientmedicalrecord',
            tv
        ).subscribe({
            next: (r) => {
                if (r?.Status === 1) {
                    this.fileList = r?.Data?.[0] || [];
                } else {
                    this.fileList = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },

            error: (err) => {
                console.error(
                    'Medical Records API Error:',
                    err
                );
                this.fileList = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    viewRecord(record: any): void {
        if (!record?._url) {
            console.error(
                'Medical record URL not found'
            );
            return;
        }
        window.open(
            record._url,
            '_blank'
        );
    }

    openAddSheet(): void {
        this.isSheetOpen = true;
    }

    closeSheet(): void {
        this.isSheetOpen = false;
    }

    MedicalRecordSaved(): void {
        this.closeSheet();
        this.getFileList();
    }

    deleteRecord(record: any): void {
        const userId = sessionStorage.getItem('id');
        if (!userId) {
            this.toastr.error(
                'User ID not found'
            );
            return;
        }
        this.deletingRecordId = record?.ID;
        this.cdr.detectChanges();
        const tv: tags[] = [
            {
                T: 'dk1',
                V: record?.ID
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
            'patientmedicalrecord',
            tv
        ).subscribe({
            next: (r) => {
                this.deletingRecordId = null;
                this.cdr.detectChanges();
                this.toastr.success(
                    'Medical record deleted successfully'
                );
                this.getFileList();
            },
            error: (err) => {
                console.error(
                    'Medical record API Error:',
                    err
                );
                this.deletingRecordId = null;
                this.cdr.detectChanges();
                this.toastr.error(
                    'Failed to delete Medical record'
                );
            }
        });
    }
}