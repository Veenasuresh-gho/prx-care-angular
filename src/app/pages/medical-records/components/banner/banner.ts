import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-medical-records-banner',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './banner.html'
})
export class MedicalRecordsBannerComponent {

    private readonly router = inject(Router);

    handleViewRecords(): void {
        this.router.navigate(['/records']);
    }
}