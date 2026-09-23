import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { VitalGraphComponent } from '../vitals-graph/vitals-graph';


interface VitalItem {
  title: string;
  apiName: string
  icon: string;
  unit: string;
  value: number | string | undefined | null;
  color: string;
  iconColor: string;
  normal?: string;
}

@Component({
  selector: 'app-vital-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    VitalGraphComponent,
  ],
  templateUrl: './vital-card.html',
  styleUrl: './vital-card.css',
})
export class VitalCardComponent {

  @Input() recentVitals: any;

  constructor(
    private dialog: MatDialog
  ) { }

  get vitals(): VitalItem[] {
    return [
      {
        title: 'Heart Rate',
        apiName: "HeartRate",
        icon: 'favorite',
        unit: 'bpm',
        value: this.recentVitals?.HeartRate,
        color: '#fef2f2',
        iconColor: '#ef4444',
        normal: '60 - 100 bpm',
      },
      {
        title: 'Systolic',
        apiName: "Systolic",
        icon: 'monitor_heart',
        unit: 'mmHg',
        value: this.recentVitals?.Systolic,
        color: '#fff7ed',
        iconColor: '#f97316',
        normal: '90 - 120 mmHg',
      },
      {
        title: 'Diastolic',
        apiName: "Diastolic",
        icon: 'monitor_heart',
        unit: 'mmHg',
        value: this.recentVitals?.Diastolic,
        color: '#fefce8',
        iconColor: '#f59e0b',
        normal: '60 - 80 mmHg',
      },
      {
        title: 'Respiratory Rate',
        apiName: "RespiratoryRate",
        icon: 'air',
        unit: 'Breath/min',
        value: this.recentVitals?.RespiratoryRate,
        color: '#f7fee7',
        iconColor: '#eab308',
        normal: '12 - 20 breaths/min',
      },
      {
        title: 'Body Temperature',
        apiName: "BodyTemperature",
        icon: 'device_thermostat',
        unit: '°F',
        value: this.recentVitals?.BodyTemperature,
        color: '#f0fdf4',
        iconColor: '#84cc16',
        normal: '97.7°F - 99.5°F',
      },
      {
        title: 'Oxygen Saturation',
        apiName: "OxygenSaturation",
        icon: 'water_drop',
        unit: '%',
        value: this.recentVitals?.OxygenSaturation,
        color: '#ecfdf5',
        iconColor: '#22c55e',
        normal: '95% - 100%',
      },
      {
        title: 'Blood Glucose',
        apiName: "BloodGlucose",
        icon: 'bloodtype',
        unit: 'mg/dL',
        value: this.recentVitals?.BloodGlucose,
        color: '#def8de',
        iconColor: '#10b981',
        normal: '70 - 99 mg/dL',
      },
      {
        title: 'Weight',
        apiName: "PatientWeight",
        icon: 'monitor_weight',
        unit: 'kg',
        value: this.recentVitals?.PatientWeight,
        color: '#f0fdfa',
        iconColor: '#14b8a6',
        normal: '90 - 100 Healthy range varies by height',
      },
      {
        title: 'Height',
        apiName: "Height",
        icon: 'height',
        unit: 'cm',
        value: this.recentVitals?.Height,
        color: '#ecfeff',
        iconColor: '#06b6d4',
      },
      {
        title: 'Sleep',
        apiName: "Sleep",
        icon: 'bedtime',
        unit: 'hrs',
        value: this.recentVitals?.Sleep,
        color: '#f0f9ff',
        iconColor: '#0ea5e9',
        normal: '7 - 9 hrs/day',
      },
      {
        title: 'Steps',
        apiName: "Steps",
        icon: 'directions_walk',
        unit: '',
        value: this.recentVitals?.Steps,
        color: '#eff6ff',
        iconColor: '#3b82f6',
        normal: '7000 - 10000 steps/day',
      },
      {
        title: 'Body Surface Area',
        apiName: "BodySurfaceArea",
        icon: 'crop_free',
        unit: 'm²',
        value: this.recentVitals?.BSA,
        color: '#eef2ff',
        iconColor: '#6366f1',
      },
      {
        title: 'Body Mass Index',
        apiName: "BodyMassIndex",
        icon: 'monitor_weight',
        unit: 'kg/m²',
        value: this.recentVitals?.BMI,
        color: '#f5f3ff',
        iconColor: '#8b5cf6',
      },
    ];
  }

  openVitalGraph(vital: VitalItem): void {
    this.dialog.open(VitalGraphComponent, {
      width: '750px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'vital-graph-dialog',
      data: { title: vital.title, apiName: vital.apiName, unit: vital.unit, },
    });
  }
}
