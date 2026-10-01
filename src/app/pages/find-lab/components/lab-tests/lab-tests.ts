import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';

@Component({
    selector: 'lab-tests',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './lab-tests.html',
    styleUrl: './lab-tests.css'
})
export class LabTests implements OnInit {
    private srv = inject(GHOService);
    constructor(private cdr: ChangeDetectorRef) {}

    @Input() labId: string | null = null;
    @Input() serviceType = 0;
    @Output() closed = new EventEmitter<void>();

    res: ghoresult = new ghoresult();
    loading = false;
    services: any[] = [];
    searchText = '';
    selectedCategory = 'All';
    categories: string[] = [];
    bookingMessageVisible = false;
    selectedService: any = null;

    ngOnInit(): void {
        this.getServices();
    }

    getServices(): void {
        if (!this.labId) {
            return;
        }
        this.loading = true;
        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.labId
            },
            {
                T: 'dk2',
                V: this.serviceType.toString()
            },
            {
                T: 'c10',
                V: '4'
            }
        ];
        this.srv.getdata('findlab', tv).subscribe({
            next: (r) => {
                this.services = r.Data?.[0] ?? [];
                this.categories = [
                    'All',
                    ...new Set(
                        this.services
                            .map(item => item.TestCategory)
                            .filter(Boolean)
                    )
                ];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Lab Services API Error:', err);
                this.services = [];
                this.categories = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    get filteredServices(): any[] {
        const search = this.searchText.trim().toLowerCase();
        return this.services.filter(service => {
            const matchesCategory =
                this.selectedCategory === 'All' ||
                service.TestCategory === this.selectedCategory;
            const matchesSearch =
                !search ||
                service.TestName?.toLowerCase().includes(search) ||
                service.TestDescription?.toLowerCase().includes(search);

            return matchesCategory && matchesSearch;
        });
    }

    selectCategory(category: string): void {
        this.selectedCategory = category;
    }

    close(): void {
        this.closed.emit();
    }

    bookService(service: any): void {
        this.selectedService = service;
        this.bookingMessageVisible = true;
    }

    closeBookingMessage(): void {
        this.bookingMessageVisible = false;
        this.selectedService = null;
    }

    get title(): string {
        return this.serviceType === 0
            ? 'Available Lab Tests'
            : 'Available Scans';
    }

    get subtitle(): string {
        return this.serviceType === 0
            ? 'Choose a test from the available laboratory services'
            : 'Choose a scan from the available diagnostic services';
    }
}