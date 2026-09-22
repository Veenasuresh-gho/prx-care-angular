import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BannerComponent } from './components/banner/banner';
import { MedicationSection } from './components/medication-section/medication-section';

@Component({
selector: 'app-medications',
standalone: true,
imports: [MatTabsModule,
BannerComponent,
MedicationSection],
templateUrl: './medications.html',
styleUrl: './medications.css'
})
export class MedicationsComponent {

@Input() medications: any[] = [];
@Input() prescriptions: any[] = [];

onRefetch(): void {
// Add your refetch logic here
}
}
