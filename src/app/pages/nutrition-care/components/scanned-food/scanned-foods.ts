import {
    ChangeDetectorRef,
    Component,
    OnInit,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

import { GHOService } from '../../../../services/gho.service';
import { tags } from '../../../../models/gho-model';

interface ScannedFoods {
    id: string | number;
    foodName: string;
    imageUrl?: string;
    date?: string;
    totalCalories: string | number;
    totalProtein: string | number;
    totalCarbs: string | number;
    totalFat: string | number;
    addedToMeal?: number;
}

@Component({
    selector: 'app-scanned-food',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule
    ],
    templateUrl: './scanned-foods.html'
})
export class ScannedFoodS implements OnInit {
    private ghoService = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    patientId = sessionStorage.getItem('id');

    mealTypeId = '';
    date = '';
    nutritionList: ScannedFoods[] = [];
    selectedItems: ScannedFoods[] = [];
    isLoading = false;
    open = false;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.mealTypeId = params['mealTypeId'] || '';
            this.date = params['date'] || '';
            this.getNutrition();
        });
    }

    getNutrition(): void {
        if (!this.patientId) {
            console.error('Patient ID not found');
            return;
        }

        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.patientId
            },
            {
                T: 'c10',
                V: '3'
            }
        ];

        this.isLoading = true;
        this.cdr.detectChanges();

        this.ghoService
            .getdata('foodnutrition', tv)
            .subscribe({
                next: (response: any) => {
                    if (response?.Status !== 1) {
                        this.nutritionList = [];
                        this.isLoading = false;
                        this.cdr.detectChanges();
                        return;
                    }

                    const data = response?.Data?.[0] || [];
                    this.nutritionList = data.map((item: any) => ({
                        id: item.ID,
                        foodName: item.FoodName,
                        imageUrl: item._url,
                        date: item.CreatedAt,
                        totalCalories: item.TotalCalories,
                        totalProtein: item.TotalProtein,
                        totalCarbs: item.TotalCarbs,
                        totalFat: item.TotalFat,
                        addedToMeal: item.AddedtoMeal
                    }));

                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (error) => {
                    console.error(
                        'Failed to get scanned foods:',
                        error
                    );

                    this.nutritionList = [];
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
    }

    handleToggle(item: ScannedFoods): void {
        const exists = this.selectedItems.some(
            selected => selected.id === item.id
        );

        if (exists) {
            this.selectedItems = this.selectedItems.filter(
                selected => selected.id !== item.id
            );
        } else {
            this.selectedItems = [
                ...this.selectedItems,
                item
            ];
        }

        this.cdr.detectChanges();
    }

    isSelected(id: string | number): boolean {
        return this.selectedItems.some(
            item => item.id === id
        );
    }

    openMealDialog(): void {
        if (!this.selectedItems.length) {
            return;
        }

        this.open = true;
    }

    closeMealDialog(): void {
        this.open = false;
        this.selectedItems = [];
        this.cdr.detectChanges();
    }

    goBack(): void {
        this.router.navigate(['/nutrition']);
    }
}