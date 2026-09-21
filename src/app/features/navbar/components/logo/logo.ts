import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logo.html'
})
export class Logo {
  href = input<string>('/');
  alt = input<string>('Logo');
}