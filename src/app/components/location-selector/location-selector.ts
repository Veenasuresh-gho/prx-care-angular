import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  of,
  catchError,
  Subject,
  takeUntil,
  Observable
} from 'rxjs';
import { GHOService } from '../../services/gho.service';
import { tags } from '../../models/gho-model';
import { environment } from '../../../enviornments/environment';
import { MapPinConfirmComponent } from '../map-pin-confirm/map-pin-confirm';

export interface LocationResult {
  addressID?: number | string;
  label?: string;
  houseNo?: string;
  buildingName?: string;
  landmark?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  fullAddress?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MapPinConfirmComponent
  ],
  templateUrl: './location-selector.html',
  styleUrl: './location-selector.css'
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly dialogRef = inject(MatDialogRef<LocationSelectorComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);
  private readonly cdr = inject(ChangeDetectorRef);

  srv = inject(GHOService);
  patientId = '';
  initialAddress = '';
  showSavedAddresses = true;
  allowCurrentLocation = true;
  private autocompleteService: any;
  private geocoder: any;
  googleLoaded = false;
  searchControl = new FormControl('');
  suggestions: any[] = [];
  savedAddresses: LocationResult[] = [];
  loadingSuggestions = false;
  loadingAddresses = false;
  loadingCurrentLocation = false;
  selectedAddressId: number | string | null = null;
  dialogStep: 'search' | 'map' = 'search';
  pendingLocation: LocationResult | null = null;

  ngOnInit(): void {
    this.patientId = this.dialogData?.patientId ?? '';
    this.initialAddress = this.dialogData?.initialAddress ?? '';
    this.showSavedAddresses =
      this.dialogData?.showSavedAddresses ?? true;
    this.allowCurrentLocation =
      this.dialogData?.allowCurrentLocation ?? true;

    this.loadGoogleMaps()
      .then(() => {
        this.initializeGoogle();
        this.setupSearch();
      })
      .catch(error => {
        console.error('Google Maps loading failed:', error);
      });

    this.getAddresses();
  }

  private loadGoogleMaps(): Promise<void> {
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places
    ) {
      this.googleLoaded = true;
      return Promise.resolve();
    }

    const existingScript =
      document.getElementById('google-maps-script');

    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', () => {
          this.googleLoaded = true;
          resolve();
        });

        existingScript.addEventListener('error', () =>
          reject(new Error('Google Maps failed to load'))
        );
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');

      script.id = 'google-maps-script';
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.googleLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Unable to load Google Maps'));
      };

      document.head.appendChild(script);
    });
  }

  private initializeGoogle(): void {
    if (!window.google?.maps) {
      console.error('Google Maps is not available');
      return;
    }

    this.autocompleteService =
      new window.google.maps.places.AutocompleteService();

    this.geocoder =
      new window.google.maps.Geocoder();
    this.googleLoaded = true;
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((value: string | null): Observable<any[]> => {
          const searchText = value?.trim() ?? '';

          if (!searchText) {
            this.suggestions = [];
            this.loadingSuggestions = false;
            return of([]);
          }

          if (!this.autocompleteService) {
            return of([]);
          }

          this.loadingSuggestions = true;
          return this.searchPlaces(searchText).pipe(
            catchError(error => {
              console.error(
                'Google autocomplete error:',
                error
              );
              return of([]);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((results: any[]) => {
        this.suggestions = results;
        this.loadingSuggestions = false;
        this.cdr.detectChanges();
      });
  }

  searchPlaces(searchText: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.autocompleteService.getPlacePredictions(
        {
          input: searchText,
          componentRestrictions: {
            country: 'in'
          }
        },
        (
          predictions: any[],
          status: string
        ) => {
          if (
            status ===
            window.google.maps.places.PlacesServiceStatus.OK
          ) {
            observer.next(predictions ?? []);
          } else {
            observer.next([]);
          }

          observer.complete();
        }
      );
    });
  }

  getAddresses(): void {
    if (!this.patientId) {
      console.error('Patient ID not found');
      return;
    }

    this.loadingAddresses = true;

    const tv: tags[] = [
      { T: 'dk1', V: '' },
      { T: 'dk2', V: this.patientId },
      { T: 'c10', V: '3' }
    ];

    this.srv
      .getdata('address', tv)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: r => {
          this.savedAddresses = r.Data?.[0] ?? [];
          this.loadingAddresses = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Address API Error:', err);
          this.savedAddresses = [];
          this.loadingAddresses = false;
          this.cdr.detectChanges();
        }
      });
  }

  selectSuggestion(suggestion: any): void {
    const placeId = suggestion?.place_id;

    if (!placeId || !this.geocoder) {
      return;
    }

    this.loadingSuggestions = true;
    this.geocoder.geocode(
      { placeId },
      (
        results: any[],
        status: string
      ) => {
        this.loadingSuggestions = false;

        if (
          status !== 'OK' ||
          !results?.length
        ) {
          console.error(
            'Place details failed:',
            status
          );
          return;
        }

        const result = results[0];
        const location = result.geometry.location;
        const locationResult: LocationResult = {
          formattedAddress:
            result.formatted_address,
          latitude: location.lat(),
          longitude: location.lng(),
          fullAddress:
            result.formatted_address
        };
        this.openMap(locationResult);
      }
    );
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      console.error(
        'Geolocation is not supported'
      );
      return;
    }

    if (!this.geocoder) {
      console.error(
        'Google Geocoder is not ready'
      );
      return;
    }

    this.loadingCurrentLocation = true;

    navigator.geolocation.getCurrentPosition(
      position => {
        this.reverseGeocode(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      error => {
        console.error(
          'Current location failed:',
          error
        );
        this.loadingCurrentLocation = false;
      }
    );
  }

  reverseGeocode(
    latitude: number,
    longitude: number
  ): void {
    this.geocoder.geocode(
      {
        location: {
          lat: latitude,
          lng: longitude
        }
      },
      (
        results: any[],
        status: string
      ) => {
        this.loadingCurrentLocation = false;

        if (
          status !== 'OK' ||
          !results?.length
        ) {
          console.error(
            'Reverse geocoding failed:',
            status
          );
          return;
        }
        const result = results[0];
        const locationResult: LocationResult = {
          formattedAddress:
            result.formatted_address,
          latitude,
          longitude,
          fullAddress:
            result.formatted_address
        };
        this.openMap(locationResult);
      }
    );
  }

  selectSavedAddress(
    address: LocationResult
  ): void {
    this.selectedAddressId =
      address.addressID ?? null;
    const fullAddress = [
      address.houseNo,
      address.buildingName,
      address.landmark,
      address.formattedAddress
    ]
      .filter(Boolean)
      .join(', ');

    this.closeWithLocation({
      ...address,
      fullAddress
    });
  }

  openMap(location: LocationResult): void {
    this.pendingLocation = location;
    this.dialogStep = 'map';
    this.cdr.detectChanges();
  }

  backToSearch(): void {
    this.dialogStep = 'search';
    this.pendingLocation = null;
    this.cdr.detectChanges();
  }

  handleMapConfirm(
    location: LocationResult
  ): void {
    this.closeWithLocation(location);
  }

  private closeWithLocation(
    location: LocationResult
  ): void {
    this.dialogRef.close(location);
  }

  close(): void {
    this.dialogRef.close();
  }

  getAddressText(
    address: LocationResult
  ): string {
    return [
      address.houseNo,
      address.buildingName,
      address.landmark,
      address.formattedAddress
    ]
      .filter(Boolean)
      .join(', ');
  }

  getAddressIcon(
    label?: string
  ): string {
    switch (label?.toLowerCase()) {
      case 'home':
        return 'home';
      case 'work':
        return 'work';
      default:
        return 'location_on';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
