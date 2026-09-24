import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';
import { AddDoctorReview } from '../add-reviews/add-doctor-review';
import { ViewReviews } from '../view-reviews/view-reviews';

@Component({
    selector: 'app-consultation-summary-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './consultation-summary-dialog.html',
    styleUrl: './consultation-summary-dialog.css'
})
export class ConsultationSummaryDialog implements OnChanges {
    private srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);

    @Input() open = false;
    @Input() appointment: any = null;
    @Output() openChange = new EventEmitter<boolean>();

    loading = false;
    appointmentDetails: any = null;
    presentComplaints: any = null;
    physicalExamination: any = null;
    diagnosis: any = null;
    treatmentSummary: any = null;
    aiDiagnosis: any = null;
    followUpInfo: any = null;
    treatmentPlan: any = null;
    medications: any[] = [];
    tests: any[] = [];

    private dialog = inject(MatDialog);

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['open']?.currentValue === true &&
            this.appointment?.ID
        ) {
            this.getConsultationDetails();
        }
    }

    getConsultationDetails(): void {
        const appointmentId = this.appointment?.ID;

        if (!appointmentId) {
            return;
        }

        this.loading = true;

        const tv: tags[] = [
              {
                T: 'dk1',
                V: String(appointmentId)
              },
            // {
            //     T: 'dk1',
            //     V: '900007'
            // },
            {
                T: 'c10',
                V: '17'
            }
        ];

        this.srv.getdata('care', tv).subscribe({
            next: (r) => {
                const data = r.Data ?? [];

                this.presentComplaints = data?.[0]?.[0] ?? null;
                this.physicalExamination = data?.[1]?.[0] ?? null;
                this.diagnosis = data?.[2]?.[0] ?? null;
                this.treatmentSummary = data?.[3]?.[0] ?? null;
                this.aiDiagnosis = data?.[4]?.[0] ?? null;
                this.followUpInfo = data?.[5]?.[0] ?? null;
                this.treatmentPlan = data?.[6]?.[0] ?? null;
                this.appointmentDetails = data?.[7]?.[0] ?? null;

                const prescriptionData = data?.[8]?.[0]?.prescriptions;
                const labData = data?.[9]?.[0]?.labs;
                this.medications = this.parseJsonArray(prescriptionData);
                this.tests = this.parseJsonArray(labData);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Consultation Summary API Error:', err);
                this.resetData();
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    private parseJsonArray(value: any): any[] {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    get prescriptionMedicines(): any[] {
        return this.medications.flatMap(prescription =>
            Array.isArray(prescription?.d)
                ? prescription.d
                : []
        );
    }

    get labTests(): any[] {
        return this.tests.flatMap(labOrder =>
            Array.isArray(labOrder?.tests)
                ? labOrder.tests
                : []
        );
    }

    close(): void {
        this.open = false;
        this.openChange.emit(false);
    }

    private resetData(): void {
        this.appointmentDetails = null;
        this.presentComplaints = null;
        this.physicalExamination = null;
        this.diagnosis = null;
        this.treatmentSummary = null;
        this.aiDiagnosis = null;
        this.followUpInfo = null;
        this.treatmentPlan = null;
        this.medications = [];
        this.tests = [];
    }

    formatDate(date: string | null | undefined): string {
        if (!date) {
            return '—';
        }

        try {
            return new Date(date).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return date;
        }
    }

    get doctorImage(): string {
        return (
            this.appointment?._urlDocImg ||
            this.appointmentDetails?.patUrl ||
            ''
        );
    }

    get doctorName(): string {
        return this.appointment?.Doctor || '—';
    }

    get specialty(): string {
        return this.appointment?.Specialty || '—';
    }

    get status(): string {
        return this.appointment?.AppointmentStatus || 'Completed';
    }

    get patientName(): string {
        return (
            this.appointmentDetails?.Patient ||
            this.appointment?.Patient ||
            '—'
        );
    }
    addReview(item: any): void {
        const dialogRef = this.dialog.open(AddDoctorReview, {
            width: '520px',
            maxWidth: '95vw',
            data: {
                doctorId: item.DoctorID,
                doctorName: `${item.Title || ''} ${item.Doctor || ''}`.trim(),
                specialty: item.Specialty,
                doctorImage: item._urlDocImg
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    viewReviews(item: any): void {
        const dialogRef = this.dialog.open(ViewReviews, {
            width: '520px',
            maxWidth: '95vw',
            maxHeight: '85vh',
            data: {
                doctorId: item.DoctorID,
                patientId: sessionStorage.getItem('id'),
                doctorName: `${item.Title || ''} ${item.Doctor || ''}`.trim(),
                specialty: item.Specialty,
                doctorImage: item._urlDocImg
            }
        });
    }
}