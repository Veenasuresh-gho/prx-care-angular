import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { GHOService } from '../../services/gho.service';

export interface Country {
  CountryID: number;
  CountryName: string;
  CountryCode: string;
  MinLength: number;
  MaxLength: number;
}

@Component({
  selector: 'app-country-select-field',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './country-select-field.html',
})
export class CountrySelectField implements OnInit {

  @Input() selectedCountryCode = '';
  @Input() placeholder = 'Select country';
  @Input() disabled = false;

  @Output() selectedCountryCodeChange =
    new EventEmitter<string>();

  @Output() countryChange =
    new EventEmitter<Country>();

  countryList: Country[] = [];

  constructor(private srv: GHOService) {}

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList(): void {
    const tv = [
      { T: 'c10', V: '99' },
    ];

    this.srv.getdata('lists', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.countryList = res.Data[0] ?? [];
        }
      },
    });
  }

  onCountryChange(code: string): void {
    this.selectedCountryCodeChange.emit(code);

    const country = this.countryList.find(
      item => item.CountryCode === code
    );

    if (country) {
      this.countryChange.emit(country);
    }
  }
}