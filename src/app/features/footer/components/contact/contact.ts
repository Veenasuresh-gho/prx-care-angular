import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbItem, HeroSectionComponent } from '../../../../components/hero-section/hero-section';
import { CountryService } from '../../../../services/country-service';

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
    countryService = inject(CountryService);

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
