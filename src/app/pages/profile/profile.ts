import { Component } from '@angular/core';
import { ProfileCard } from './profile-card/profile-card';

@Component({
  selector: 'app-profile',
  imports: [ProfileCard],
  templateUrl: './profile.html',
})
export class Profile { }
