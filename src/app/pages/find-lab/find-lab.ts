import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../services/gho.service';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../models/gho-model';
import { Router } from '@angular/router';

@Component({
    selector: 'find-lab',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './find-lab.html',
    styleUrl: './find-lab.css'
})
export class FindLab implements OnInit {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    res: ghoresult = new ghoresult();

    loading = false;
    labList: any[] = [];
    searchTerm = '';
    private searchTimeout: any;
    private router = inject(Router);
    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getLabList();
    }

    getLabList(): void {
        this.loading = true;
        const location = sessionStorage.getItem('district') || '';
        const tv: tags[] = [
            {
                T: 'dk1',
                V: location
            },
            {
                T: 'dk2',
                V: this.searchTerm || ''
            },
            {
                T: 'c10',
                V: '6'
            }
        ];

        this.srv.getdata(
            'findlab',
            tv
        ).subscribe({
            next: (r) => {
                this.labList = r.Data?.[0] ?? [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(
                    'Lab API Error:',
                    err
                );
                this.labList = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSearch(): void {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.getLabList();
        }, 500);
    }

    viewLabDetails(lab: any): void {
    if (!lab?.ID) {
        return;
    }
    this.router.navigate([
        '/find-lab/lab-details',
        lab.ID
    ]);
}
}