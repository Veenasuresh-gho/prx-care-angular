import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-featured-services',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule
    ],
    templateUrl: './featured-services.html'
})
export class FeaturedServicesComponent {

    readonly features = [
        {
            title: 'Get Expert Medical Second Opinions',
            description:
                'Connect with top specialists for detailed review of your diagnosis and treatment options.',
            image: '/assets/featured1.png',
            accentColor: '#425DEA',
            bgColor: '#9BACFF54',
            textColor: '#6073D9',
            link: 'https://globalhealthopinion.com/'
        },
        {
            title: 'Peer Review by Medical Experts',
            description:
                'Get an unbiased review of your case from multiple specialists before making critical decisions.',
            image: '/assets/featured2.png',
            accentColor: '#1A5AC9',
            bgColor: '#77A9FF70',
            textColor: '#3363B7',
            link: 'https://globalhealthopinion.com/'
        },
        {
            title: 'Medical Value Travel',
            description:
                'Access coordinated hospital services and personalized care management support.',
            image: '/assets/featured3.png',
            accentColor: '#BA2B2D',
            bgColor: '#FF7E8033',
            textColor: '#B55455',
            link: 'https://mvt.care/'
        }
    ];

    explore(link: string): void {
        window.open(link, '_blank');
    }
}