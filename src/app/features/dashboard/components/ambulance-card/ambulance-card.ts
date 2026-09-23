import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../../components/button/button';

@Component({
  selector: 'app-ambulance-card',
  standalone: true,
  imports:[Button],
  templateUrl: './ambulance-card.html',
})
export class AmbulanceCard {
  private router = inject(Router);

  handleBookAmbulance(): void {
    this.router.navigateByUrl('/en/emergency-services');
  }
}