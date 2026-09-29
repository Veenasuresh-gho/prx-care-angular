import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './hero-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroSectionComponent {

  @Input() title = '';

  @Input() breadcrumbs: BreadcrumbItem[] = [];

}
