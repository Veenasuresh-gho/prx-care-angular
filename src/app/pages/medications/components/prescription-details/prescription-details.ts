import {
    Component,
    inject
} from '@angular/core';

import {
    MAT_DIALOG_DATA,
    MatDialogModule
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'prescription-details',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './prescription-details.html',
    styleUrl: './prescription-details.css'
})
export class PrescriptionDetails {

    data = inject(MAT_DIALOG_DATA);

}