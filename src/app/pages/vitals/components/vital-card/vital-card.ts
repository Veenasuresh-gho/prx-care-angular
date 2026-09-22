import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface VitalItem {
  title: string;
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
  ],
  templateUrl: './vital-card.html',
  styleUrl: './vital-card.css',
})
export class VitalCardComponent {

  @Input() recentVitals: any;

  get vitals(): VitalItem[] {
    return [
      {
        title: 'Heart Rate',
        icon: 'favorite',
        unit: 'bpm',
        value: this.recentVitals?.heartRate,
        color: '#fef2f2',
        iconColor: '#ef4444',
        normal: '60 - 100 bpm',
      },
      {
        title: 'Systolic',
        icon: 'monitor_heart',
        unit: 'mmHg',
        value: this.recentVitals?.systolic,
        color: '#fff7ed',
        iconColor: '#f97316',
        normal: '90 - 120 mmHg',
      },
      {
        title: 'Diastolic',
        icon: 'monitor_heart',
        unit: 'mmHg',
        value: this.recentVitals?.diastolic,
        color: '#fefce8',
        iconColor: '#f59e0b',
        normal: '60 - 80 mmHg',
      },
      {
        title: 'Respiratory Rate',
        icon: 'air',
        unit: 'Breath/min',
        value: this.recentVitals?.respiratoryRate,
        color: '#f7fee7',
        iconColor: '#eab308',
        normal: '12 - 20 breaths/min',
      },
      {
        title: 'Body Temperature',
        icon: 'device_thermostat',
        unit: '°F',
        value: this.recentVitals?.bodyTemperature,
        color: '#f0fdf4',
        iconColor: '#84cc16',
        normal: '97.7°F - 99.5°F',
      },
      {
        title: 'Oxygen Saturation',
        icon: 'water_drop',
        unit: '%',
        value: this.recentVitals?.oxygenSaturation,
        color: '#ecfdf5',
        iconColor: '#22c55e',
        normal: '95% - 100%',
      },
      {
        title: 'Blood Glucose',
        icon: 'bloodtype',
        unit: 'mg/dL',
        value: this.recentVitals?.bloodGlucose,
        color: '#def8de',
        iconColor: '#10b981',
        normal: '70 - 99 mg/dL',
      },
      {
        title: 'Weight',
        icon: 'monitor_weight',
        unit: 'kg',
        value: this.recentVitals?.weight,
        color: '#f0fdfa',
        iconColor: '#14b8a6',
        normal: '90 - 100 Healthy range varies by height',
      },
      {
        title: 'Height',
        icon: 'height',
        unit: 'cm',
        value: this.recentVitals?.height,
        color: '#ecfeff',
        iconColor: '#06b6d4',
      },
      {
        title: 'Sleep',
        icon: 'bedtime',
        unit: 'hrs',
        value: this.recentVitals?.sleep,
        color: '#f0f9ff',
        iconColor: '#0ea5e9',
        normal: '7 - 9 hrs/day',
      },
      {
        title: 'Steps',
        icon: 'directions_walk',
        unit: '',
        value: this.recentVitals?.step,
        color: '#eff6ff',
        iconColor: '#3b82f6',
        normal: '7000 - 10000 steps/day',
      },
      {
        title: 'Body Surface Area',
        icon: 'crop_free',
        unit: 'm²',
        value: this.recentVitals?.bsa,
        color: '#eef2ff',
        iconColor: '#6366f1',
      },
      {
        title: 'Body Mass Index',
        icon: 'monitor_weight',
        unit: 'kg/m²',
        value: this.recentVitals?.bmi,
        color: '#f5f3ff',
        iconColor: '#8b5cf6',
      },
    ];
  }
}