
import {
    Component,
    NgZone,
    OnDestroy,
    OnInit,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../enviornments/environment';

declare global {
    interface Window {
        google: any;
    }
}

interface LocationDetails {
    place: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    distance: string;
}

interface LocationSuggestion {
    placeId: string;
    description: string;
}

@Component({
    selector: 'app-location-dropdown',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './location-dropdown.html'
})
export class LocationDropdown implements OnInit, OnDestroy {
    private readonly zone = inject(NgZone);
    private readonly toastr = inject(ToastrService);

    private autocompleteService: any;
    private geocoder: any;

    private searchTimer?: ReturnType<typeof setTimeout>;
    private scriptTimer?: ReturnType<typeof setTimeout>;
    private searchRequestId = 0;
    private destroyed = false;

    private readonly storageKey = 'navbar-location';

    open = false;
    googleLoaded = false;

    loadingLocation = false;
    loadingSelection = false;
    loadingSearch = false;

    selectedPlaceId: string | null = null;

    searchValue = '';
    suggestions: LocationSuggestion[] = [];

    location: LocationDetails = this.defaultLocation();

    ngOnInit(): void {
        this.restoreLocation();

        this.loadGoogleMaps()
            .then(() => {
                if (!this.destroyed) {
                    this.initializeGoogle();
                }
            })
            .catch(error => {
                if (this.destroyed) return;

                console.error('Google Maps loading failed:', error);
                this.toastr.error('Unable to load location services');
            });
    }

    ngOnDestroy(): void {
        this.destroyed = true;

        clearTimeout(this.searchTimer);
        clearTimeout(this.scriptTimer);

        this.searchRequestId++;
    }

    private defaultLocation(): LocationDetails {
        return {
            place: null,
            district: null,
            city: null,
            state: null,
            country: null,
            address: null,
            latitude: null,
            longitude: null,
            distance: '50 Km'
        };
    }

    get displayLocation(): string {
        return (
            this.location.place ||
            this.location.city ||
            this.location.district ||
            this.location.state ||
            this.location.address ||
            'Select location'
        );
    }

    toggleDropdown(): void {
        this.open = !this.open;

        if (!this.open) {
            clearTimeout(this.searchTimer);

            this.searchRequestId++;
            this.searchValue = '';
            this.suggestions = [];
            this.loadingSearch = false;
            this.loadingSelection = false;
            this.selectedPlaceId = null;
        }
    }

    private loadGoogleMaps(): Promise<void> {
        if (window.google?.maps?.places) {
            this.googleLoaded = true;
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            let script = document.getElementById(
                'google-maps-script'
            ) as HTMLScriptElement | null;

            const handleLoad = () => {
                clearTimeout(this.scriptTimer);

                if (window.google?.maps?.places) {
                    this.zone.run(() => {
                        this.googleLoaded = true;
                        resolve();
                    });
                } else {
                    reject(new Error('Google Places library is unavailable'));
                }
            };

            const handleError = () => {
                clearTimeout(this.scriptTimer);
                reject(new Error('Unable to load Google Maps'));
            };

            this.scriptTimer = setTimeout(() => {
                if (!window.google?.maps?.places) {
                    reject(new Error('Google Maps loading timed out'));
                }
            }, 15000);

            if (script) {
                if (script.dataset['loaded'] === 'true' && window.google?.maps?.places) {
                    handleLoad();
                    return;
                }

                script.addEventListener('load', handleLoad, { once: true });
                script.addEventListener('error', handleError, { once: true });

                return;
            }

            script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                script!.dataset['loaded'] = 'true';
                handleLoad();
            };

            script.onerror = handleError;

            document.head.appendChild(script);
        });
    }

    private initializeGoogle(): void {
        if (!window.google?.maps?.places) {
            return;
        }

        this.autocompleteService =
            new window.google.maps.places.AutocompleteService();

        this.geocoder = new window.google.maps.Geocoder();

        this.googleLoaded = true;
    }

    onSearch(value: string): void {
        this.searchValue = value;

        clearTimeout(this.searchTimer);

        const requestId = ++this.searchRequestId;
        const input = value.trim();

        if (!input) {
            this.suggestions = [];
            this.loadingSearch = false;
            return;
        }

        if (!this.autocompleteService) {
            this.loadingSearch = false;
            return;
        }

        this.loadingSearch = true;

        this.searchTimer = setTimeout(() => {
            if (this.destroyed || requestId !== this.searchRequestId) {
                return;
            }

            this.autocompleteService.getPlacePredictions(
                {
                    input,
                    componentRestrictions: { country: 'in' }
                },
                (results: any[], status: string) => {
                    this.zone.run(() => {
                        if (
                            this.destroyed ||
                            requestId !== this.searchRequestId
                        ) {
                            return;
                        }

                        this.loadingSearch = false;

                        this.suggestions =
                            status ===
                                window.google.maps.places.PlacesServiceStatus.OK
                                ? (results || []).map(item => ({
                                    placeId: item.place_id,
                                    description: item.description
                                }))
                                : [];
                    });
                }
            );
        }, 250);
    }

    selectLocation(suggestion: LocationSuggestion): void {
        if (
            !this.geocoder ||
            this.loadingSelection ||
            this.loadingLocation
        ) {
            return;
        }

        this.loadingSelection = true;
        this.selectedPlaceId = suggestion.placeId;

        this.geocoder.geocode(
            { placeId: suggestion.placeId },
            (results: any[], status: string) => {
                this.zone.run(() => {
                    if (this.destroyed) return;

                    this.loadingSelection = false;
                    this.selectedPlaceId = null;

                    if (status !== 'OK' || !results?.length) {
                        this.toastr.error('Unable to fetch location details');
                        return;
                    }

                    this.saveLocation(results);
                });
            }
        );
    }

    useCurrentLocation(): void {
        if (this.loadingLocation || this.loadingSelection) {
            return;
        }

        if (!navigator.geolocation) {
            this.toastr.error('Geolocation is not supported by your browser');
            return;
        }

        if (!this.geocoder) {
            this.toastr.error('Location service is not ready yet');
            return;
        }

        this.loadingLocation = true;

        navigator.geolocation.getCurrentPosition(
            position => {
                if (this.destroyed) return;

                this.geocoder.geocode(
                    {
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    },
                    (results: any[], status: string) => {
                        this.zone.run(() => {
                            if (this.destroyed) return;

                            this.loadingLocation = false;

                            if (status !== 'OK' || !results?.length) {
                                this.toastr.error('Unable to identify your location');
                                return;
                            }

                            this.saveLocation(results);
                        });
                    }
                );
            },
            error => {
                this.zone.run(() => {
                    if (this.destroyed) return;

                    this.loadingLocation = false;

                    if (error.code === error.PERMISSION_DENIED) {
                        this.toastr.error(
                            'Please allow location access in your browser'
                        );
                    } else if (error.code === error.TIMEOUT) {
                        this.toastr.error(
                            'Location detection timed out. Please try again'
                        );
                    } else {
                        this.toastr.error(
                            'Unable to fetch your current location'
                        );
                    }
                });
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000
            }
        );
    }

    private saveLocation(results: any[]): void {
        const result =
            results.find(item =>
                item.address_components?.some((component: any) =>
                    component.types.includes('administrative_area_level_3')
                )
            ) || results[0];

        const components = result.address_components || [];

        const get = (type: string): string | null =>
            components.find((component: any) =>
                component.types.includes(type)
            )?.long_name || null;

        const nextLocation: LocationDetails = {
            place:
                get('sublocality_level_1') ||
                get('sublocality') ||
                get('neighborhood'),
            district:
                get('administrative_area_level_3') ||
                get('administrative_area_level_2'),
            city:
                get('locality') ||
                get('administrative_area_level_2'),
            state: get('administrative_area_level_1'),
            country: get('country'),
            address: result.formatted_address || null,
            latitude: result.geometry?.location?.lat() ?? null,
            longitude: result.geometry?.location?.lng() ?? null,
            distance: this.location.distance || '50 Km'
        };

        this.location = nextLocation;

        try {
            sessionStorage.setItem(
                this.storageKey,
                JSON.stringify(nextLocation)
            );
        } catch (error) {
            console.error('Unable to save location:', error);
        }

        clearTimeout(this.searchTimer);

        this.searchRequestId++;
        this.searchValue = '';
        this.suggestions = [];
        this.loadingSearch = false;
        this.loadingLocation = false;
        this.loadingSelection = false;
        this.selectedPlaceId = null;
        this.open = false;
    }

    private restoreLocation(): void {
        try {
            const saved = sessionStorage.getItem(this.storageKey);

            if (saved) {
                this.location = {
                    ...this.defaultLocation(),
                    ...JSON.parse(saved)
                };
            }
        } catch {
            this.location = this.defaultLocation();
        }
    }

    clearLocation(): void {
        try {
            sessionStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Unable to clear saved location:', error);
        }

        this.location = this.defaultLocation();
        this.searchValue = '';
        this.suggestions = [];
        this.loadingSearch = false;
        this.loadingLocation = false;
        this.loadingSelection = false;
        this.selectedPlaceId = null;
    }
}
