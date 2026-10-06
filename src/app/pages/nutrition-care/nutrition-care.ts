import {
    Component,
    OnInit
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NutritionChat } from './components/nutrition-chat/nutrition-chat';


@Component({
    selector: 'app-nutrition-care',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        NutritionChat
    ],
    templateUrl: './nutrition-care.html'
})
export class NutritionCare implements OnInit {

    open = false;
    analyzedResult: string | null = null;

    constructor(
        private dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit(): void {
        const result = sessionStorage.getItem('nutritionAnalyzedResult');

        if (result) {
            this.analyzedResult = result;

            if (window.innerWidth < 1024) {
                this.openChat();
            }
        }
    }

    openChat(): void {
        this.dialog.open(NutritionChat, {
            width: '100%',
            maxWidth: '100%',
            height: '95vh',
            panelClass: 'nutrition-chat-dialog'
        });
    }

    handleDiet(): void {
        this.router.navigate(['/dashboard/diet-plans']);
    }

    handleScan(): void {
        this.router.navigate(['/nutrition-scanner']);
    }

    handleTrack(): void {
        this.router.navigate(['/nutrition/track-your-food']);
    }

    handleConsultation(): void {
        this.router.navigate(
            ['/schedule-appointment'],
            {
                queryParams: {
                    id: 3
                }
            }
        );
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}


