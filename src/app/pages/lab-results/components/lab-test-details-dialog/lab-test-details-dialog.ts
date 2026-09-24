import {
    Component,
    Inject
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-lab-test-details-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: './lab-test-details-dialog.html',
    styleUrl: './lab-test-details-dialog.css'
})
export class LabTestDetailsDialog {

    constructor(
        private dialogRef: MatDialogRef<LabTestDetailsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    

    get rangeValues(): { low: number; high: number } | null {
        const normalValues = this.data?.NormalValues;

        if (!normalValues) {
            return null;
        }

        const match = String(normalValues).match(
            /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/
        );

        if (!match) {
            return null;
        }

        return {
            low: parseFloat(match[1]),
            high: parseFloat(match[2])
        };
    }

    get resultPosition(): number {
        const range = this.rangeValues;

        const result = parseFloat(
            String(this.data?.Result || '').replace(/,/g, '')
        );

        if (!range || Number.isNaN(result)) {
            return 50;
        }

        const rangeSize = range.high - range.low;

        if (rangeSize <= 0) {
            return 50;
        }

        const position =
            ((result - range.low) / rangeSize) * 100;

        return Math.max(0, Math.min(100, position));
    }

    close(): void {
        this.dialogRef.close();
    }
}