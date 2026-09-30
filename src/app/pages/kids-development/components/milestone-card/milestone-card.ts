import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-milestone-card',
  imports: [],
  templateUrl: './milestone-card.html',
})
export class MilestoneCard {
  @Input() childAge = '';
}
