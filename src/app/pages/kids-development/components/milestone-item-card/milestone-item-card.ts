import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-milestone-item-card',
  standalone: true,
  templateUrl: './milestone-item-card.html',
})

export class MilestoneItemCard {
  @Input() icon = '';
  @Input() iconBgClassName = '';
  @Input() title = '';
  @Input() description = '';
}

