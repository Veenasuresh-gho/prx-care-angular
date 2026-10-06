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

interface DeliveryTracking {
  assignedTime?: string | null;
  acceptedTime?: string | null;
  startDeliveryTime?: string | null;
  completedTime?: string | null;
}

interface Step {
  id: string;
  label: string;
  icon: string;
  status: StepStatus;
  timestamp?: string;
}

interface StepDefinition {
  id: string;
  label: string;
  icon: string;
  field: string | null;
}

const STEP_DEFINITIONS: StepDefinition[] = [
  {
    id: 'confirmed',
    label: 'Confirmed',
    icon: 'check',
    field: null,
  },
  {
    id: 'assigned',
    label: 'Assigned',
    icon: 'person_check',
    field: 'assignedTime',
  },
  {
    id: 'accepted',
    label: 'Accepted',
    icon: 'assignment_turned_in',
    field: 'acceptedTime',
  },
  {
    id: 'on-the-way',
    label: 'On the way',
    icon: 'directions_car',
    field: 'startDeliveryTime',
  },
  {
    id: 'completed',
    label: 'Done',
    icon: 'check',
    field: 'completedTime',
  },
];

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './tracker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tracker implements OnChanges {
  private srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  @Input() orderId: string | number | null = null;

  @Input() serviceLabel =
    'General physician visit';

  deliveryTracking: DeliveryTracking | null = null;

  steps: Step[] = [];

  progressPct = 0;

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
      {
        T: 'dk1',
        V: String(this.orderId),
      },
    ];

    this.srv.getdata('hcare_', tags).subscribe({
      next: (res) => {
        this.deliveryTracking =
          res?.Status === 1
            ? this.getTrackingData(res)
            : null;

        this.buildSteps();

        this.isLoading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(
          'Tracking API error:',
          error
        );

        this.deliveryTracking = null;

        this.buildSteps();

        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private getTrackingData(
    res: any
  ): DeliveryTracking | null {
    const data = res?.Data?.[0];

    if (!data) {
      return null;
    }

    return Array.isArray(data)
      ? data[0] ?? null
      : data;
  }

  private hasValue(
    value: unknown
  ): boolean {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
    );
  }

  private buildSteps(): void {
    let lastCompletedIndex = 0;

    if (this.deliveryTracking) {
      STEP_DEFINITIONS.forEach(
        (step, index) => {
          if (
            step.field &&
            this.hasValue(
              this.deliveryTracking?.[
                step.field as keyof DeliveryTracking
              ]
            )
          ) {
            lastCompletedIndex = index;
          }
        }
      );
    }

    this.steps = STEP_DEFINITIONS.map(
      (step, index) => {
        let status: StepStatus;

        if (index < lastCompletedIndex) {
          status = 'completed';
        } else if (
          index === lastCompletedIndex
        ) {
          status = 'current';
        } else {
          status = 'upcoming';
        }

        const value =
          step.field && this.deliveryTracking
            ? this.deliveryTracking[
                step.field as keyof DeliveryTracking
              ]
            : null;

        return {
          id: step.id,
          label: step.label,
          icon: step.icon,
          status,
          timestamp: this.hasValue(value)
            ? String(value)
            : undefined,
        };
      }
    );

    /*
     * If completedTime exists,
     * mark the final step as completed.
     */
    if (
      this.deliveryTracking?.completedTime
    ) {
      this.steps =
        this.steps.map((step, index) => ({
          ...step,
          status:
            index ===
            STEP_DEFINITIONS.length - 1
              ? 'completed'
              : step.status,
        }));

      lastCompletedIndex =
        STEP_DEFINITIONS.length - 1;
    }

    this.progressPct =
      this.steps.length > 1
        ? (lastCompletedIndex /
            (this.steps.length - 1)) *
          100
        : 0;
  }
}