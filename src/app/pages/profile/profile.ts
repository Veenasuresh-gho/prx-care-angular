import {
  Component,
  inject,
  Signal,
} from '@angular/core';

import { ROUTER_OUTLET_DATA } from '@angular/router';

import { ProfileCard } from './profile-card/profile-card';
import { Address } from './address/address';

@Component({
  selector: 'app-profile',
  imports: [ProfileCard, Address],
  templateUrl: './profile.html',
})
export class Profile {
  outletData = inject(
    ROUTER_OUTLET_DATA
  ) as Signal<{
    patientDetails: any;
    advertisements?: any[];
  }>;
}

