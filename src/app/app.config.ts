import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { CountryService } from './services/country-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true
    }),

     provideAppInitializer(() => {
      return inject(CountryService).detectCountry();
    })
  ]
};