import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { GHOService } from '../../../../../../services/gho.service';

type StepStatus = 'completed' | 'current' | 'upcoming';

/** Field names exactly as returned by the API. */
interface DeliveryTracking {
  BookingID?: number;
  AssignedAt?: string | null;
  AcceptedAt?: string | null;
  EnrouteAt?: string | null;
  ServiceCompletedAt?: string | null;
}

interface Step {
  id: string;
  label: string;
  icon: string;
  status: StepStatus;
  /** e.g. "Fri, Oct 9" */
  dateLabel?: string;
  /** e.g. "11:11 AM" */
  timeLabel?: string;
}

interface StepDefinition {
  id: string;
  label: string;
  icon: string;
  field: keyof DeliveryTracking | null;
}

/*
 * Icons must exist in the classic "Material Icons" font.
 * `person_check` only exists in Material Symbols, so it never rendered.
 */
const STEP_DEFINITIONS: StepDefinition[] = [
  { id: 'confirmed', label: 'Confirmed', icon: 'check', field: null },
  { id: 'assigned', label: 'Assigned', icon: 'how_to_reg', field: 'AssignedAt' },
  { id: 'accepted', label: 'Accepted', icon: 'assignment_turned_in', field: 'AcceptedAt' },
  { id: 'on-the-way', label: 'On the way', icon: 'directions_car', field: 'EnrouteAt' },
  { id: 'completed', label: 'Done', icon: 'done_all', field: 'ServiceCompletedAt' },
];

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './tracker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tracker implements OnChanges {
  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  @Input() orderId: string | number | null = null;
  @Input() serviceLabel = 'General physician visit';

  deliveryTracking: DeliveryTracking | null = null;
  steps: Step[] = [];
  isLoading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderId']) {
      this.getTracking();
    }
  }

  private getTracking(): void {
    if (this.orderId === null) {
      return;
    }

    this.isLoading = true;

    const tags = [
      { T: 'dk1', V: String(this.orderId) },
      { T: 'c10', V: '3' },
    ];

    this.srv.getdata('hcare_', tags).subscribe({
      next: (res) => {
        this.deliveryTracking =
          res?.Status === 1 ? this.getTrackingData(res) : null;

        this.buildSteps();
        this.isLoading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Tracking API error:', error);

        this.deliveryTracking = null;
        this.buildSteps();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** API shape: Data = [ [ { ...tracking } ] ] */
  private getTrackingData(res: any): DeliveryTracking | null {
    const data = res?.Data?.[0];

    if (!data) {
      return null;
    }

    return Array.isArray(data) ? data[0] ?? null : data;
  }

  private hasValue(value: unknown): boolean {
    return (
      value !== null && value !== undefined && String(value).trim() !== ''
    );
  }

  /**
   * Splits "Fri, Oct 9, 11:11 AM" into
   * { date: "Fri, Oct 9", time: "11:11 AM" }.
   * Falls back to the raw string as the date if the format differs.
   */
  private splitDateTime(value: string): { date?: string; time?: string } {
    const text = value.trim();
    const match = text.match(/^(.*?),?\s*(\d{1,2}:\d{2}\s?[AP]M)$/i);

    if (match) {
      return {
        date: match[1].trim() || undefined,
        time: match[2].toUpperCase(),
      };
    }

    return { date: text };
  }

  private buildSteps(): void {
    const tracking = this.deliveryTracking;
    const lastIndex = STEP_DEFINITIONS.length - 1;

    // Furthest step that has a timestamp ("Confirmed" is always reached).
    let lastCompletedIndex = 0;

    if (tracking) {
      STEP_DEFINITIONS.forEach((step, index) => {
        if (step.field && this.hasValue(tracking[step.field])) {
          lastCompletedIndex = index;
        }
      });
    }

    this.steps = STEP_DEFINITIONS.map((step, index) => {
      // The final step has no "in progress" state: once done, it is completed.
      const status: StepStatus =
        index < lastCompletedIndex ||
        (index === lastCompletedIndex && index === lastIndex)
          ? 'completed'
          : index === lastCompletedIndex
            ? 'current'
            : 'upcoming';

      const raw = step.field && tracking ? tracking[step.field] : null;
      const { date, time } = this.hasValue(raw)
        ? this.splitDateTime(String(raw))
        : { date: undefined, time: undefined };

      return {
        id: step.id,
        label: step.label,
        icon: step.icon,
        status,
        dateLabel: date,
        timeLabel: time,
      };
    });
  }
}