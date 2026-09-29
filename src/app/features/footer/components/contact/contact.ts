import {
    ChangeDetectionStrategy,
    Component,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem, HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        HeroSectionComponent
    ],
    templateUrl: './contact.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {

    breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'Home',
            href: '/dashboard'
        },
        {
            label: 'Contact'
        }
    ];



}
