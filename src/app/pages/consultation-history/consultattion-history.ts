import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../services/gho.service';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../models/gho-model';
import { EmptyMessageComponent } from '../../components/empty-message/empty-message';
import { ConsultationSummaryDialog } from './components/consultation-summary/consultation-summary-dialog';


@Component({
    selector: 'app-consultation-history',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        EmptyMessageComponent,
        ConsultationSummaryDialog
    ],
    templateUrl: './consultation-history.html',
    styleUrl: './consultation-history.css',
})
export class ConsultationHistoryComponent implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();
    loading = false;
    consultationHistory: any[] = [];
    filteredHistory: any[] = [];
    search = '';
    sortBy: 'newest' | 'oldest' = 'newest';
    selectedConsultation: any = null;
    summaryDialogOpen = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getUserConsultationHistory();
    }

    getUserConsultationHistory(): void {
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
                V: '16'
            }
        ];
        this.srv.getdata('care', tv).subscribe({
            next: (r) => {
                this.consultationHistory =
                    r.Data?.[0] ?? [];
                this.filterAndSort();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Consultation History API Error:', err);
                this.consultationHistory = [];
                this.filteredHistory = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSearchChange(): void {
        this.filterAndSort();
    }
    setSort(
        sort: 'newest' | 'oldest'
    ): void {
        this.sortBy = sort;
        this.filterAndSort();
    }

    filterAndSort(): void {
        const term =
            this.search
                .trim()
                .toLowerCase();


        let filtered =
            this.consultationHistory;
        if (term) {
            filtered =
                this.consultationHistory.filter(
                    (item) => {
                        const searchableFields = [
                            item.Doctor,
                            item.Specialty,
                            item.TenantName,
                            item.Patient,
                            item.AppointmentStatus,
                            item.ID?.toString(),
                            item.AptStatus?.toString(),
                        ];
                        return searchableFields
                            .filter(Boolean)
                            .some((field) =>
                                String(field)
                                    .toLowerCase()
                                    .includes(term)
                            );

                    }
                );

        }

        filtered = [...filtered].sort(
            (a, b) => {
                const dateA =
                    new Date(
                        a.AppointmentDate
                    ).getTime();
                const dateB =
                    new Date(
                        b.AppointmentDate
                    ).getTime();
                return this.sortBy === 'newest'
                    ? dateB - dateA
                    : dateA - dateB;
            }
        );
        this.filteredHistory = filtered;
    }

    get resultText(): string {
        if (this.search.trim()) {
            return `${this.filteredHistory.length} of ${this.consultationHistory.length} results`;
        }
        return `${this.consultationHistory.length} consultations`;
    }

    trackById(index: number, item: any): number {
        return item.ID ?? index;
    }

    viewDetails(item: any): void {
        this.selectedConsultation = item;
        this.summaryDialogOpen = true;
    }

}