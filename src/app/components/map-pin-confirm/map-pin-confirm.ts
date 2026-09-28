import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationResult } from '../location-selector/location-selector';

@Component({
    selector: 'app-map-pin-confirm',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './map-pin-confirm.html',
    styleUrl: './map-pin-confirm.css'
})
export class MapPinConfirmComponent
    implements AfterViewInit, OnDestroy {

    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>;
    @Input()
    initialLocation: LocationResult | null = null;
    @Output()
    back = new EventEmitter<void>();
    @Output()
    confirm = new EventEmitter<LocationResult>();

    private readonly cdr = inject(ChangeDetectorRef);
    private map: any;
    private idleListener: any;
    private geocoder: any;
    addressInfo: LocationResult | null = null;
    resolving = false;
    locating = false;

    ngAfterViewInit(): void {
        this.initializeMap();
    }

    private initializeMap(): void {
        if (!window.google?.maps) {
            console.error('Google Maps is not available');
            return;
        }

        this.geocoder = new window.google.maps.Geocoder();

        const center = this.getInitialCenter();

        this.map = new window.google.maps.Map(
            this.mapContainer.nativeElement,
            {
                center,
                zoom: 17,
                disableDefaultUI: true,
                clickableIcons: false,
                gestureHandling: 'greedy'
            }
        );

        this.idleListener =
            this.map.addListener(
                'idle',
                () => this.resolveCenter()
            );

        this.resolveCenter();
    }

    private getInitialCenter(): {
        lat: number;
        lng: number;
    } {
        if (
            this.initialLocation?.latitude != null &&
            this.initialLocation?.longitude != null
        ) {
            return {
                lat: this.initialLocation.latitude,
                lng: this.initialLocation.longitude
            };
        }
        return {
            lat: 20.5937,
            lng: 78.9629
        };
    }

    private resolveCenter(): void {
        if (!this.map || !this.geocoder) {
            return;
        }
        const center = this.map.getCenter();
        if (!center) {
            return;
        }

        const latitude = center.lat();
        const longitude = center.lng();
        this.resolving = true;
        this.cdr.detectChanges();
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
                this.resolving = false;
                if (
                    status !== 'OK' ||
                    !results?.length
                ) {
                    this.addressInfo = {
                        latitude,
                        longitude
                    };
                    this.cdr.detectChanges();
                    return;
                }
                const result = results[0];
                this.addressInfo = {
                    formattedAddress:
                        result.formatted_address,
                    fullAddress:
                        result.formatted_address,
                    latitude,
                    longitude
                };
                this.cdr.detectChanges();
            }
        );
    }

    useCurrentLocation(): void {
        if (
            !navigator.geolocation ||
            !this.map
        ) {
            return;
        }
        this.locating = true;
        this.cdr.detectChanges();
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude =
                    position.coords.latitude;
                const longitude =
                    position.coords.longitude;
                this.map.panTo({
                    lat: latitude,
                    lng: longitude
                });
                this.map.setZoom(17);
                this.locating = false;
                this.cdr.detectChanges();
            },
            error => {
                console.error(
                    'Current location failed:',
                    error
                );
                this.locating = false;
                this.cdr.detectChanges();
            }
        );
    }

    handleBack(): void {
        this.back.emit();
    }

    handleConfirm(): void {
        if (
            !this.addressInfo ||
            this.resolving ||
            this.addressInfo.latitude == null ||
            this.addressInfo.longitude == null
        ) {
            return;
        }
        this.confirm.emit(
            this.addressInfo
        );
    }

    ngOnDestroy(): void {
        if (this.idleListener) {
            window.google?.maps?.event?.removeListener(
                this.idleListener
            );
        }
    }
}
