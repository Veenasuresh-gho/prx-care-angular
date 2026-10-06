import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    ViewChild,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AiService } from '../../../../services/ai-service';
import { GHOService } from '../../../../services/gho.service';
import { FileUploadService } from '../../../../services/file-upload-service';
import { tags } from '../../../../models/gho-model';
import { HowToImageSection } from '../how-to-image-section/how-to-image-section';

interface IngredientNutrition {
    name: string;
    estimated_quantity?: string;
    nutrition: {
        calories: string;
        protein: string;
        carbs: string;
        fat: string;
    };
}

interface NutritionResult {
    food: string;
    estimated_portion: string;
    nutrition: {
        calories: string;
        protein: string;
        carbs: string;
        fat: string;
    };
    ingredients: IngredientNutrition[];
    confidence: string;
}

@Component({
    selector: 'app-food-scanner',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        HowToImageSection
    ],
    templateUrl: './food-scanner.html'
})
export class FoodScanner implements OnDestroy {
    @ViewChild('fileInput')
    fileInput!: ElementRef<HTMLInputElement>;

    private aiService = inject(AiService);
    private ghoService = inject(GHOService);
    private fileUploadService = inject(FileUploadService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private zone = inject(NgZone);

    file: File | null = null;
    preview: string | null = null;
    result: NutritionResult | null = null;

    loading = false;
    noFoodDetected = false;

    patientId = sessionStorage.getItem('id');

    openFilePicker(): void {
        this.fileInput?.nativeElement.click();
    }

    handleFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const selectedFile = input.files?.[0];

        if (!selectedFile) {
            return;
        }

        this.file = selectedFile;

        if (this.preview) {
            URL.revokeObjectURL(this.preview);
        }

        this.preview = URL.createObjectURL(selectedFile);
        this.result = null;
        this.noFoodDetected = false;
        this.loading = true;

        this.cdr.detectChanges();

        this.handleUpload(selectedFile);
    }

    handleUpload(selectedFile?: File): void {
        const fileToUpload = selectedFile || this.file;

        if (!fileToUpload) {
            return;
        }

        this.zone.run(() => {
            this.loading = true;
            this.noFoodDetected = false;
            this.cdr.detectChanges();
        });

        this.aiService
            .uploadScanFile('nutrition-scan', fileToUpload)
            .subscribe({
                next: (response: any) => {
                    this.zone.run(() => {
                        try {
                            const parsed =
                                typeof response?.data === 'string'
                                    ? JSON.parse(response.data)
                                    : response?.data;

                            const text =
                                parsed?.output?.[0]?.content?.[0]?.text;

                            if (!text) {
                                this.handleNoFood();
                                return;
                            }

                            const nutritionData: NutritionResult =
                                typeof text === 'string'
                                    ? JSON.parse(text)
                                    : text;

                            if (!nutritionData?.food) {
                                this.handleNoFood();
                                return;
                            }

                            this.result = nutritionData;
                            this.noFoodDetected = false;

                            this.cdr.detectChanges();

                            this.saveNutrition(
                                nutritionData,
                                fileToUpload
                            );
                        } catch (error) {
                            console.error(
                                'Failed to parse nutrition response:',
                                error
                            );

                            this.handleNoFood();
                        }
                    });
                },
                error: (error) => {
                    this.zone.run(() => {
                        console.error('Nutrition scan failed:', error);
                        this.handleNoFood();
                    });
                }
            });
    }

    private handleNoFood(): void {
        this.zone.run(() => {
            this.noFoodDetected = true;
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    private saveNutrition(
        nutritionData: NutritionResult,
        file: File
    ): void {
        if (!this.patientId) {
            console.error('Patient ID not found');

            this.zone.run(() => {
                this.loading = false;
                this.cdr.detectChanges();
            });

            return;
        }

        const tv: tags[] = [
            {
                T: 'dk1',
                V: this.patientId
            },
            {
                T: 'c1',
                V: nutritionData.food
            },
            {
                T: 'c2',
                V: nutritionData.nutrition.calories
            },
            {
                T: 'c3',
                V: nutritionData.nutrition.protein
            },
            {
                T: 'c4',
                V: nutritionData.nutrition.carbs
            },
            {
                T: 'c5',
                V: nutritionData.nutrition.fat
            },
            {
                T: 'c10',
                V: '1'
            }
        ];

        this.ghoService
            .getdata('foodnutrition', tv)
            .subscribe({
                next: async (response: any) => {
                    if (response?.Status !== 1) {
                        console.error(
                            'Failed to save nutrition:',
                            response?.Info
                        );

                        this.zone.run(() => {
                            this.loading = false;
                            this.cdr.detectChanges();
                        });

                        return;
                    }

                    const foodNutritionId =
                        response?.Data?.[0]?.[0]?.id;

                    if (!foodNutritionId) {
                        console.error(
                            'Food nutrition ID was not returned'
                        );

                        this.zone.run(() => {
                            this.loading = false;
                            this.cdr.detectChanges();
                        });

                        return;
                    }

                    await this.uploadFoodImage(
                        file,
                        foodNutritionId
                    );
                },
                error: (error) => {
                    console.error(
                        'Save nutrition API error:',
                        error
                    );

                    this.zone.run(() => {
                        this.loading = false;
                        this.cdr.detectChanges();
                    });
                }
            });
    }

    private async uploadFoodImage(
        file: File,
        foodNutritionId: string | number
    ): Promise<void> {
        if (!this.patientId) {
            this.zone.run(() => {
                this.loading = false;
                this.cdr.detectChanges();
            });

            return;
        }

        try {
            const uploadSuccess =
                await this.fileUploadService.handleFileUpload(
                    String(foodNutritionId),
                    this.patientId,
                    file,
                    '42'
                );

            this.zone.run(() => {
                if (!uploadSuccess) {
                    console.error(
                        'Food image upload failed'
                    );
                    this.loading = false;
                    this.cdr.detectChanges();
                    return;
                }
                this.loading = false;
                this.cdr.detectChanges();
            });
        } catch (error) {
            console.error(
                'Food image upload error:',
                error
            );

            this.zone.run(() => {
                this.loading = false;
                this.cdr.detectChanges();
            });
        }
    }

    resetScanner(): void {
        this.result = null;
        this.file = null;
        this.noFoodDetected = false;
        this.loading = false;

        if (this.preview) {
            URL.revokeObjectURL(this.preview);
            this.preview = null;
        }

        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
        this.cdr.detectChanges();
    }

    goBack(): void {
        this.router.navigate(['/nutrition']);
    }

    ngOnDestroy(): void {
        if (this.preview) {
            URL.revokeObjectURL(this.preview);
        }
    }
}