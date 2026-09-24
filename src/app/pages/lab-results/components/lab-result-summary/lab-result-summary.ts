import {
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';
import { LabTestDetailsDialog } from '../lab-test-details-dialog/lab-test-details-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-lab-result-summary',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatTableModule
    ],
    templateUrl: './lab-result-summary.html',
    styleUrl: './lab-result-summary.css'
})
export class LabOrderSummary implements OnChanges {

    @Input() labOrderId: number | string | null = null;
    @Input() doctor: string | null = null;
    @Input() date: string | null = null;
    @Input() testStatus: string | null = null;
    private srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);
    selectedTab = 0;
    labResultSummary: any[] = [];
    groupedLabResults: any[] = [];
    isLoading = false;
    displayedColumns: string[] = [
        'testName',
        'result',
        'unit',
        'normalValues'
    ];
    private dialog = inject(MatDialog);
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['labOrderId'] &&
            this.labOrderId
        ) {
            this.getLabResults();
        }
    }

    getLabResults(): void {
        const patientId = sessionStorage.getItem('id');
        if (!patientId || !this.labOrderId) {
            return;
        }
        const tv: tags[] = [
            {
                T: 'dk1',
                V: patientId
            },
            {
                T: 'dk2',
                V: String(this.labOrderId)
            },
            {
                T: 'c10',
                V: '21'
            }
        ];
        this.isLoading = true;
        this.labResultSummary = [];
        this.groupedLabResults = [];
        this.cdr.detectChanges();
        this.srv.getdata('care', tv).subscribe({
            next: (r) => {
                if (r.Status === 1) {
                    this.labResultSummary = r.Data?.[0] || [];
                    this.groupLabResults();
                } else {
                    this.labResultSummary = [];
                    this.groupedLabResults = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.labResultSummary = [];
                this.groupedLabResults = [];
                console.error(
                    'Lab Results API Error:',
                    err
                );

                this.cdr.detectChanges();
            }
        });
    }

    groupLabResults(): void {
        const grouped: Record<string, any> = {};
        this.labResultSummary.forEach((item: any) => {
            const category = item.Header || 'Other';
            if (!grouped[category]) {
                grouped[category] = {
                    category,
                    tests: []
                };
            }

            grouped[category].tests.push(item);
        });
        this.groupedLabResults = Object.values(grouped);
    }

  viewTestDetails(test: any): void {
    this.dialog.open(LabTestDetailsDialog, {
        width: '700px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        data: {
            ...test,
            Doctor: this.doctor,
            Date: this.date,
            TestStatus:this.testStatus
        }
    });
}
}