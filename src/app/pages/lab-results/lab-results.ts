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
import { LabOrderSummary } from './components/lab-result-summary/lab-result-summary';

@Component({
    selector: 'app-lab-results',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        LabOrderSummary
    ],
    templateUrl: './lab-results.html',
    styleUrl: './lab-results.css'
})
export class LabResults implements OnInit {
    private srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);

    selectedTab = 0;
    labResults: any[] = [];
    groupedResults: any[] = [];
    selectedLabResult: any = null;
    isLoading = false;

    ngOnInit(): void {
        this.getLabResults();
    }

    getLabResults(): void {
        const patientId = sessionStorage.getItem('id');
        if (!patientId) {
            return;
        }
        const tv: tags[] = [
            {
                T: 'dk1',
                V: patientId
            },
            {
                T: 'c10',
                V: '20'
            }
        ];
        this.isLoading = true;
        this.cdr.detectChanges();
        this.srv.getdata('care', tv).subscribe({
            next: (r) => {
                if (r.Status === 1) {
                    this.labResults = r.Data?.[0] || [];
                    this.groupResults();
                } else {
                    this.labResults = [];
                    this.groupedResults = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.labResults = [];
                this.groupedResults = [];
                console.error('Lab Results API Error:', err);
                this.cdr.detectChanges();
            }
        });
    }

    toggleTests(item: any): void {
    item.expanded = !item.expanded;
}

    groupResults(): void {
        const grouped: Record<number, any> = {};
        this.labResults.forEach((item: any) => {
            const labOrderId = item.LabOrderID;
            if (!grouped[labOrderId]) {
                grouped[labOrderId] = {
                    labOrderId: labOrderId,
                    doctor: item.Doctor,
                    date: item.ResultUpdatedAt,
                    category: item.Category,
                    labReportUrl: item.LabReportUrl,
                    tests: []
                };
            }
            grouped[labOrderId].tests.push({
                name: item.Test,
                status: item.TestStatus
            });
        });
        this.groupedResults = Object.values(grouped);
    }

    handleViewSummary(labResult: any): void {
        this.selectedLabResult = labResult;
        this.selectedTab = 1;
        this.cdr.detectChanges();
    }
}