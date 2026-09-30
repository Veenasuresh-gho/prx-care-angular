import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';

type SortOption = 'newest' | 'oldest';

@Component({
    selector: 'app-medical-records-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule
    ],
    templateUrl: './medical-records-list.html'
})
export class MedicalRecordsList implements OnInit {

    private srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);
    records: any[] = [];
    filteredRecords: any[] = [];
    search = '';
    sortBy: SortOption = 'newest';
    isLoading = false;

    ngOnInit(): void {
        this.getRecords();
    }

    getRecords(): void {
        const patientId = sessionStorage.getItem('id');

        if (!patientId) {
            this.records = [];
            this.filteredRecords = [];
            return;
        }

        const tv: tags[] = [
            {
                T: 'dk2',
                V: patientId
            },
            {
                T: 'c10',
                V: '6'
            }
        ];

        this.isLoading = true;

        this.srv
            .getdata('patientmedicalrecord', tv)
            .subscribe({
                next: (r) => {
                    if (r?.Status === 1) {
                        this.records = r.Data?.[0] || [];
                    } else {
                        this.records = [];
                    }
                    this.applyFilters();
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },

                error: (err) => {
                    console.error(
                        'Medical Records API Error:',
                        err
                    );
                    this.records = [];
                    this.filteredRecords = [];
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
    }

    applyFilters(): void {
        const term = this.search
            .trim()
            .toLowerCase();

        let result = [...this.records];

        if (term) {
            result = result.filter((record: any) =>
                [
                    record.FileName,
                    record.Category,
                    record.RecordID
                ]
                    .filter(Boolean)
                    .some((field: string) =>
                        field
                            .toString()
                            .toLowerCase()
                            .includes(term)
                    )
            );
        }

        const withIndex = result.map(
            (record, index) => ({
                record,
                index
            })
        );

        withIndex.sort((a, b) => {
            const difference =
                a.index - b.index;
            return this.sortBy === 'newest'
                ? -difference
                : difference;
        });

        this.filteredRecords =
            withIndex.map(
                item => item.record
            );
    }

    onSearchChange(value: string): void {
        this.search = value;
        this.applyFilters();
    }

    onSortChange(value: SortOption): void {
        this.sortBy = value;
        this.applyFilters();
    }

    viewRecord(record: any): void {
        if (!record?._url) {
            return;
        }
        window.open(
            record._url,
            '_blank'
        );
    }
}