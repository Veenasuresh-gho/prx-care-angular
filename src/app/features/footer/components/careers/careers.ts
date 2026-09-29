import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [HeroSectionComponent, MatIconModule],
  templateUrl: './careers.html'
})
export class Careers {
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Careers' }
  ];

  benefits = [
    {
      icon: 'volunteer_activism',
      title: 'Meaningful Impact',
      description:
        'Contribute to healthcare solutions that make a real difference in people’s lives.'
    },
    {
      icon: 'groups',
      title: 'Collaborative Team',
      description:
        'Work alongside a passionate, diverse, and skilled team of professionals.'
    },
    {
      icon: 'home_work',
      title: 'Flexible Work Environment',
      description:
        'Enjoy remote and hybrid options that support work-life balance.'
    },
    {
      icon: 'health_and_safety',
      title: 'Health & Wellness',
      description:
        'Access comprehensive benefits designed to keep you and your family healthy.'
    },
    {
      icon: 'trending_up',
      title: 'Growth Opportunities',
      description:
        'Pursue learning, development, and certifications to grow your career.'
    },
    {
      icon: 'diversity_3',
      title: 'Inclusive Culture',
      description:
        'Be part of a transparent, inclusive, and empowering workplace.'
    }
  ];
}