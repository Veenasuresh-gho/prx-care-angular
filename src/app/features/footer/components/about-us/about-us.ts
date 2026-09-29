import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem, HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
    selector: 'app-about-us',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        HeroSectionComponent
    ],
    templateUrl: './about-us.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutUs {

    breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Home',
            href: '/dashboard'
        },
        {
            label: 'About'
        }
    ];



}
