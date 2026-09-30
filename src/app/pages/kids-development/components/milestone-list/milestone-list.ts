import { Component, Input } from '@angular/core';
import { MilestoneItemCard } from '../milestone-item-card/milestone-item-card';

interface MilestoneData {
  id: string;
  icon: string;
  iconBgClassName: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-milestone-list',
  standalone: true,
  imports: [
    MilestoneItemCard,
  ],
  templateUrl: './milestone-list.html',
})
export class MilestoneList {
  @Input() grossMotor = '';
  @Input() fineMotor = '';
  @Input() languageHearing = '';
  @Input() socialAdaptive = '';

  get milestoneData(): MilestoneData[] {
    return [
      {
        id: 'gross-motor',
        icon: '🚼',
        iconBgClassName: 'bg-orange-100',
        title: 'Gross motor',
        description: this.grossMotor,
      },
      {
        id: 'fine-motor',
        icon: '✋',
        iconBgClassName: 'bg-sky-100',
        title: 'Fine motor',
        description: this.fineMotor,
      },
      {
        id: 'language-hearing',
        icon: '💬',
        iconBgClassName: 'bg-amber-100',
        title: 'Language / Hearing',
        description: this.languageHearing,
      },
      {
        id: 'social-adaptive',
        icon: '❤️',
        iconBgClassName: 'bg-pink-100',
        title: 'Social / Adaptive',
        description: this.socialAdaptive,
      },
    ];
  }
}

