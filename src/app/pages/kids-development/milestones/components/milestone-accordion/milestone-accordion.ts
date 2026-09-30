import {
  Component,
  Input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface MilestoneCategoryData {
  milestoneId: number;
  minAgeMonths: number;
  maxAgeMonths: number;
  ageGroup: string;
  grossMotor: string;
  fineMotor: string;
  languageHearing: string;
  socialAdaptive: string;
}

interface CategoryMeta {
  key:
  | 'grossMotor'
  | 'fineMotor'
  | 'languageHearing'
  | 'socialAdaptive';
  title: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-milestone-accordion',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './milestone-accordion.html',
})
export class MilestoneAccordion {

  @Input() data: MilestoneCategoryData[] = [];

  @Input() defaultOpenId?: number;

  openId: number | undefined;

  readonly subtitleByMilestoneId: Record<number, string> = {
    1: 'Early bonding and basic responses',
    2: 'First smiles and social awareness',
    3: 'Rolling, reaching and babbling',
    4: 'Sitting up and early words',
    5: 'First steps and first words',
    6: 'Walking, climbing and exploring',
    7: 'Running, jumping and talking',
    8: 'Independent play and full sentences',
    9: 'Hopping, drawing and storytelling',
    10: 'School-ready skills',
  };

  readonly headerPalette = [
    {
      bg: 'bg-amber-50',
      chip: 'bg-amber-100',
    },
    {
      bg: 'bg-emerald-50',
      chip: 'bg-emerald-100',
    },
    {
      bg: 'bg-sky-50',
      chip: 'bg-sky-100',
    },
    {
      bg: 'bg-violet-50',
      chip: 'bg-violet-100',
    },
    {
      bg: 'bg-rose-50',
      chip: 'bg-rose-100',
    },
  ];

  readonly categoryMeta: CategoryMeta[] = [
    {
      key: 'grossMotor',
      title: 'Gross motor',
      icon: '🚼',
      iconBg: 'bg-orange-100',
    },
    {
      key: 'fineMotor',
      title: 'Fine motor',
      icon: '✋',
      iconBg: 'bg-sky-100',
    },
    {
      key: 'languageHearing',
      title: 'Language / Hearing',
      icon: '💬',
      iconBg: 'bg-amber-100',
    },
    {
      key: 'socialAdaptive',
      title: 'Social / Adaptive',
      icon: '❤️',
      iconBg: 'bg-pink-100',
    },
  ];

  ngOnInit(): void {
    this.openId = this.defaultOpenId;
  }

  toggle(milestoneId: number): void {
    if (this.openId === milestoneId) {
      this.openId = undefined;
    } else {
      this.openId = milestoneId;
    }
  }

  isOpen(milestoneId: number): boolean {
    return this.openId === milestoneId;
  }

  getAgeGroupIcon(milestoneId: number): string {
    switch (milestoneId) {
      case 1:
        return '🍼';

      case 2:
        return '😊';

      case 3:
        return '🧸';

      case 4:
        return '🧘';

      case 5:
        return '🚼';

      case 6:
        return '🚶‍♀️';

      case 7:
        return '🏃‍♀️';

      case 8:
        return '🚲';

      case 9:
        return '🎨';

      case 10:
        return '🎒';

      default:
        return '👶';
    }
  }

  getPalette(index: number) {
    return this.headerPalette[
      index % this.headerPalette.length
    ];
  }
}

