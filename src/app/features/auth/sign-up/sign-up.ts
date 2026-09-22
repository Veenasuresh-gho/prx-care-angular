import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomInput } from '../../../components/input/input';
import { Button } from '../../../components/button/button';
import { GHOService } from '../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';
import { formatDateToDDMMYYYY } from '../../../utils/date';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterLink,
    CustomInput,
    Button
  ],
  templateUrl: './sign-up.html'
})
export class SignUp implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  srv = inject(GHOService);
  toastr = inject(ToastrService);

  isLoading = false;
  agreeTerms = false;
  countryList: any[] = [];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    dob: ['', Validators.required],
    nationality: ['', Validators.required],
    countrycode: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  ngOnInit(): void {
    this.getCountryList()
  }

  submit(): void {

    if (this.form.invalid || !this.agreeTerms) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const values = this.form.getRawValue();
    const formattedDate = formatDateToDDMMYYYY(values.dob ?? '');
    const tv = [
      { T: 'c1', V: values.email ?? '' },
      { T: 'c2', V: values.phone ?? '' },
      { T: 'c3', V: values.password ?? '' },
      { T: 'c4', V: values.firstName ?? '' },
      { T: 'c5', V: values.lastName ?? '' },
      { T: 'c6', V: values.nationality ?? '' },
      { T: 'c7', V: values.gender ?? '' },
      { T: 'c8', V: formattedDate ?? '' },
      { T: 'c9', V: values.countrycode ?? '' },
      { T: 'c10', V: '8' },
    ];
    this.srv.getdata('patient', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.toastr.success(res?.Data[0][0]?.msg);
          this.isLoading = false;
          this.router.navigate(['/auth/sign-in'])
        } else {
          this.toastr.error(res?.Info);
        }
      },
    });
  }

  getCountryList() {
    const tv = [
      { T: 'c10', V: '99' }
    ];
    this.srv.getdata('lists', tv).subscribe({
      next: (res) => {
        if (res.Status === 1) {
          this.countryList = res.Data;
        }
      },
    });
  }

  goToSignIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }
}