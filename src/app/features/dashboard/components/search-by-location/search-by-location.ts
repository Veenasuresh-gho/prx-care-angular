import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { GHOService } from '../../../../services/gho.service';

interface SuggestionItem {
  doctorId?: string;
  tenantName: string;
  tenantId: string | number;
  type: string;
  slug?: string;
  tenantIdAlt?: string;
}

interface SavedLocation {
  place?: string;
  district?: string;
  city?: string;
  state?: string;
  distance?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  [key: string]: unknown;
}

@Component({
  selector: 'app-search-by-location',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './search-by-location.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByLocation implements OnInit, OnDestroy {
  private readonly service = inject(GHOService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly elementRef = inject(ElementRef);

  searchTerm = '';
  displayText = '';

  suggestions: SuggestionItem[] = [];
  conditions: SuggestionItem[] = [];

  showSuggestions = false;
  loading = false;
  isFocused = false;

  private hasFetched = false;
  private isFromCondition = false;
  private selectedCondition = '';
  private placeholderTimer?: ReturnType<typeof setInterval>;

  private readonly placeholderText =
    'Search your doctor / speciality / hospital';

  private get userId(): string {
    return sessionStorage.getItem('id') || '';
  }

  private get isAuthenticated(): boolean {
    return !!sessionStorage.getItem('tkn');
  }

  get activeList(): SuggestionItem[] {
    return this.searchTerm.trim()
      ? this.suggestions
      : this.conditions;
  }

  ngOnInit(): void {
    let index = 0;

    this.placeholderTimer = setInterval(() => {
      this.displayText = this.placeholderText.substring(0, index + 1);
      index++;

      if (index >= this.placeholderText.length) {
        index = 0;
        this.displayText = '';
      }

      this.cdr.markForCheck();
    }, 70);
  }

  ngOnDestroy(): void {
    if (this.placeholderTimer) {
      clearInterval(this.placeholderTimer);
    }
  }

  private getSavedLocation(): SavedLocation {
    let savedLocation: SavedLocation = {};

    try {
      const rawLocation = sessionStorage.getItem('navbar-location');

      if (rawLocation) {
        const parsed: unknown = JSON.parse(rawLocation);

        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          savedLocation = parsed as SavedLocation;
        }
      }
    } catch (error) {
      console.error('Failed to parse saved location:', error);
    }

    const readValue = (
      key: keyof SavedLocation,
      storageKey: string,
    ): string | number | undefined => {
      const value = savedLocation[key];

      if (value !== undefined && value !== null && value !== '') {
        return typeof value === 'string' || typeof value === 'number'
          ? value
          : undefined;
      }

      return sessionStorage.getItem(storageKey) || undefined;
    };

    return {
      ...savedLocation,
      place: readValue('place', 'place') as string | undefined,
      district: readValue('district', 'district') as string | undefined,
      city: readValue('city', 'city') as string | undefined,
      state: readValue('state', 'state') as string | undefined,
      distance: readValue('distance', 'distance'),
      latitude:
        readValue('latitude', 'latitude') ??
        readValue('lat', 'lat'),
      longitude:
        readValue('longitude', 'longitude') ??
        readValue('long', 'long'),
    };
  }

  private getLocationName(location: SavedLocation): string {
    const value =
      location.place ||
      location.district ||
      location.city ||
      location.state;

    return value !== undefined && value !== null
      ? String(value)
      : '';
  }

  /**
   * Converts whatever the backend returns into SuggestionItem[].
   * Handles a flat `data` array or a `Data` list of tables.
   * Adjust the field names below once you confirm the real response.
   */
  private normalizeResults(response: any): SuggestionItem[] {
    // Case 1: flat array
    let rows: any[] = Array.isArray(response?.data) ? response.data : [];

    // Case 2: Data is a list of tables -> use the first non-empty table
    if (!rows.length && Array.isArray(response?.Data)) {
      const table = response.Data.find(
        (t: any) => Array.isArray(t) && t.length > 0,
      );
      rows = table ?? [];
    }

    return rows
      .map(
        (r: any): SuggestionItem => ({
          doctorId: r?.doctorId ?? r?.DoctorId ?? r?.DoctorID,
          tenantName: String(
            r?.tenantName ?? r?.TenantName ?? r?.Name ?? r?.name ?? '',
          ),
          tenantId: r?.tenantId ?? r?.TenantId ?? r?.TenantID ?? '',
          tenantIdAlt: r?.tenantIdAlt ?? r?.TenantIdAlt,
          type: String(r?.type ?? r?.Type ?? ''),
          slug: r?.slug ?? r?.Slug,
        }),
      )
      .filter((r) => r.tenantName.trim() !== '');
  }

  handleInitialSearch(): void {
    this.showSuggestions = true;

    if (this.conditions.length > 0) {
      this.suggestions = this.conditions;
      this.cdr.markForCheck();
      return;
    }

    if (this.loading || this.hasFetched || !this.userId) {
      this.cdr.markForCheck();
      return;
    }

    this.hasFetched = true;
    this.loading = true;
    this.cdr.markForCheck();

    this.service
      .getdata('prxcare', [
        { T: 'dk1', V: this.userId },
        { T: 'c10', V: '100' },
      ])
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response: any) => {
          const items = response?.Data?.[3] ?? [];

          this.conditions = items.map(
            (item: any): SuggestionItem => ({
              tenantName: String(item?.Condition ?? ''),
              tenantId: String(item?.SpecialtyName ?? ''),
              type: '',
            }),
          );

          this.suggestions = this.conditions;
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error('Failed to load conditions:', error);
          this.hasFetched = false;
          this.conditions = [];
          this.suggestions = [];
          this.cdr.markForCheck();
        },
      });
  }


  handleTypedSearch(): void {
    const term = this.isFromCondition
      ? this.selectedCondition.trim()
      : this.searchTerm.trim();

    if (!term) {
      this.suggestions = this.conditions;
      this.showSuggestions = true;
      this.cdr.markForCheck();
      return;
    }

    const savedLocation = this.getSavedLocation();

    const tags: { T: string; V: string }[] = [
      {
        T: 'dk1',
        V: this.getLocationName(savedLocation),
      },
      { T: 'dk2', V: term },
      { T: 'c1', V: String(savedLocation.distance ?? '') },
      { T: 'c8', V: String(savedLocation.latitude ?? '') },
      { T: 'c9', V: String(savedLocation.longitude ?? '') },
      { T: 'c10', V: '19' },
    ];

    if (this.isFromCondition) {
      tags.push({ T: 'c4', V: 'Y' });
    }

    this.showSuggestions = true;
    this.loading = true;
    this.suggestions = [];
    this.cdr.markForCheck();

    this.service
      .getdata('prxcare', tags)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response: any) => {
          console.log('Search API response:', response);
          const rawItems = Array.isArray(response?.Data)
            ? response.Data.flat()
            : Array.isArray(response?.data)
              ? response.data
              : [];

          this.suggestions = rawItems.map((item: any) => ({
            doctorId: item?.DoctorID ?? item?.DoctorId ?? item?.doctorId ?? '',
            tenantName: String(
              item?.TenantName ?? item?.tenantName ?? '',
            ),
            tenantId: item?.TenantID ?? item?.TenantId ?? item?.tenantId ?? '',
            tenantIdAlt:
              item?.TenantIDAlt ??
              item?.tenantIdAlt ??
              '',
            type: String(item?.Type ?? item?.type ?? ''),
            slug: String(item?.Slug ?? item?.slug ?? ''),
          }));

          this.cdr.markForCheck();
        },
        error: (error: any) => {
          console.error('Search failed:', error);
          this.suggestions = [];
          this.cdr.markForCheck();
        },
      });
  }


  handleInputChange(value: string): void {
    this.isFromCondition = false;
    this.selectedCondition = '';
    this.searchTerm = value;
    this.showSuggestions = true;

    if (!value.trim()) {
      this.suggestions = this.conditions;
    }

    this.cdr.markForCheck();
  }

  handleSelect(item: SuggestionItem): void {
    console.log("item", item)
    const firstLine = (item.tenantName || '').split(/\r?\n/)[0].trim();

    this.showSuggestions = false;

    if (!item.type) {
      this.searchTerm = firstLine;
      this.selectedCondition = String(item.tenantId ?? '').trim();
      this.isFromCondition = true;

      this.cdr.markForCheck();

      if (this.selectedCondition) {
        this.handleTypedSearch();
      }

      return;
    }

    this.searchTerm = firstLine;
    this.isFromCondition = false;
    this.selectedCondition = '';

    if (!this.isAuthenticated) {
      void this.router.navigate([`/auth/sign-in`]);
      this.cdr.markForCheck();
      return;
    }

    if (item.type === 'Doctor') {
      void this.router.navigate([
        `/schedule-appointment/${item.doctorId}`,
      ]);
    } else if (item.type === 'Hospital') {
      void this.router.navigate([`/hospital`], {
        queryParams: {
          tenantId: item.tenantId,
          tenantIdAlt: item.tenantIdAlt,
        },
      });
    } else {
      void this.router.navigate([`/schedule-appointment`], {
        queryParams: {
          tenantId: item.tenantId,
          type: item.type,
          name: firstLine,
        },
      });
    }

    this.cdr.markForCheck();
  }

  handleClose(): void {
    this.showSuggestions = false;
    this.searchTerm = '';
    this.selectedCondition = '';
    this.isFromCondition = false;
    this.suggestions = this.conditions;
    this.isFocused = false;
    this.cdr.markForCheck();
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'Doctor':
        return 'medical_services';
      case 'Hospital':
        return 'local_hospital';
      default:
        return 'location_on';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.isFocused = false;
      this.cdr.markForCheck();
    }
  }
}