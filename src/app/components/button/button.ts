import { Component, input } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'destructive';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  fullWidth = input(false);

  customClass = input('');
}