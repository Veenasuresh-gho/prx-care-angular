import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ChatWithExpert } from './components/chat-with-expert/chat-with-expert';


@Component({
    selector: 'app-mental-health',
    standalone: true,
    imports: [
        MatDialogModule,
        MatIconModule,
        ChatWithExpert
    ],
    templateUrl: './mental-health.html'
})
export class MentalHealth {

    constructor(
        private dialog: MatDialog,
        private router: Router
    ) { }

    openChat(): void {
        this.dialog.open(ChatWithExpert, {
            width: '100%',
            maxWidth: '100%',
            height: '95vh',
            panelClass: 'mental-health-dialog'
        });
    }

    handleTherapist(): void {
        this.router.navigate(
            ['/schedule-appointment'],
            {
                queryParams: { id: 4 }
            }
        );
    }

    handleJournaling(): void {
        this.router.navigate(['/dashboard/mental-health/journaling']);
    }

    handleMeditation(): void {
        this.router.navigate(['/dashboard/mental-health/meditation']);
    }
    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}