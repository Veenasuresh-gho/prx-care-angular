import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WellnessItem {
    label: string;
    icon: string;
    bg: string;
    hoverBg: string;
    path: string;
}

@Component({
    selector: 'app-health-wellness-care',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './health-wellness-care.html'
})
export class HealthWellnessCareComponent {
    readonly content: WellnessItem[] = [
        {
            label: 'Wellness',
            icon: 'assets/wellness.png',
            bg: '#EEEDFF',
            hoverBg: '#E1DFFF',
            path: '/wellness'
        },
        {
            label: 'Nutrition',
            icon: 'assets/nutrition.png',
            bg: '#E2F5F4',
            hoverBg: '#CDEDEC',
            path: '/nutrition'
        },
        {
            label: 'Mental Health',
            icon: 'assets/mental-health.png',
            bg: '#FFF9E5',
            hoverBg: '#FFF5D2',
            path: '/mental-health'
        }
    ];

    activeItem: string | null = null;

    navigate(path: string): void {
        window.location.href = path;
    }

    setHover(label: string): void {
        this.activeItem = label;
    }

    removeHover(): void {
        this.activeItem = null;
    }
}