import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StartChatWithBot } from './components/start-chat-with-bot/start-chat-with-bot';
import { MatIconModule } from '@angular/material/icon';
import { TalkToWellnessExpert } from './components/talk-to-wellness-expert/talk-to-wellness-expert';
import { LifestylePlan } from './components/lifestyle-plan/lifestyle-plan';
import { WellnessChat } from './components/wellness-chat/wellness-chat';

@Component({
  selector: 'app-wellness-care',
  standalone: true,
  imports: [
    MatDialogModule,
    StartChatWithBot,
    MatIconModule,
    TalkToWellnessExpert,
    LifestylePlan,
    WellnessChat
  ],
  templateUrl: './wellness-care.html'
})
export class WellnessCareComponent {

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

  startChat(): void {
    this.dialog.open(WellnessChat, {
      width: '100%',
      maxWidth: '100vw',
      height: '90vh',
      panelClass: 'wellness-chat-dialog'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}