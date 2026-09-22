import { Component, inject } from '@angular/core';
import { SheetComponent } from '../../../../components/sheet/sheet-component';
import { GHOService } from '../../../../services/gho.service';
import { ghoresult, tags } from '../../../../models/gho-model';
import { GHOUtitity } from '../../../../services/utilities';

@Component({
    selector: 'medication-section',
    standalone: true,
    imports: [
        SheetComponent
    ],
    templateUrl: './medication-section.html',
    styleUrl: './medication-section.css'
})
export class MedicationSection {

    srv = inject(GHOService);
    utl = inject(GHOUtitity);
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    loading = false;
    ds: [] = [];

    isSheetOpen = false;

    openSheet(): void {
        this.isSheetOpen = true;
    }

    closeSheet(): void {
        this.isSheetOpen = false;
    }
}