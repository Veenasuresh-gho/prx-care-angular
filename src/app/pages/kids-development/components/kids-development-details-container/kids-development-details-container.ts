import { Component, inject, Input } from '@angular/core';
import { Button } from '../../../../components/button/button';
import { MilestoneCard } from '../milestone-card/milestone-card';
import { MilestoneList } from '../milestone-list/milestone-list';
import { DevelopmentNoteCard } from '../development-note-card/development-note-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kids-development-details-container',
  imports: [Button, MilestoneCard, MilestoneList, DevelopmentNoteCard],
  templateUrl: './kids-development-details-container.html',
})
export class KidsDevelopmentDetailsContainer {
  @Input() details: any;
  private readonly router = inject(Router);
  seeWhatsNext(): void { this.router.navigate(['/kids-development/milestones']); }
}
