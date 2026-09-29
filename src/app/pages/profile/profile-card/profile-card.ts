
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { SwitchUserPopover } from '../switch-user-popover/switch-user-popover';
import { FileUploadPopover } from '../file-upload-popover/file-upload-popover';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  gender?: string;
  age?: string | number;
  city?: string;
  state?: string;
}

export interface AccountOption {
  id: string;
  name: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    SwitchUserPopover,
    FileUploadPopover,
  ],
  templateUrl: './profile-card.html',
})
export class ProfileCard implements OnChanges {
  @Input() patientDetails: Patient | null = null;
  @Input() loading = false;

  @Input() userId: string | null = null;
  @Input() owner: string | null = null;

  @Input() familyMembers: Patient[] = [];

  @Output() accountSelected =
    new EventEmitter<AccountOption>();

  @Output() refetch =
    new EventEmitter<void>();

  avatarPreview =
    signal<string | undefined>(undefined);

  isFileUploadLoading =
    signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientDetails']) {
      this.avatarPreview.set(
        this.patientDetails?.imageUrl
      );
    }
  }

  get accountOptions(): AccountOption[] {
    return this.familyMembers.map((member) => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      avatarUrl: member.imageUrl,
    }));
  }

  get location(): string {
    return [
      this.patientDetails?.city,
      this.patientDetails?.state,
    ]
      .filter(Boolean)
      .join(', ');
  }

  get patientGenderAge(): string {
    return [
      this.patientDetails?.gender,
      this.patientDetails?.age,
    ]
      .filter(Boolean)
      .join(', ');
  }

  handleSelect(account: AccountOption): void {
    this.accountSelected.emit(account);
  }

  handleFileSubmit(file: File): void {
    // Only allow images
    if (!file.type.includes('image')) {
      return;
    }

    // Remove previous blob URL
    const previousPreview = this.avatarPreview();

    if (previousPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreview);
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    this.avatarPreview.set(previewUrl);

    // Show loading
    this.isFileUploadLoading.set(true);

    /*
     * Connect your actual file upload service here.
     *
     * Example:
     *
     * this.fileUploadService.upload({
     *   fileName: file.name,
     *   fileSize: file.size,
     *   patientId: this.userId,
     *   documentTypeId: '1',
     *   file,
     * }).subscribe({
     *   next: () => {
     *     this.isFileUploadLoading.set(false);
     *     this.refetch.emit();
     *   },
     *   error: () => {
     *     this.isFileUploadLoading.set(false);
     *   }
     * });
     */

    // Temporary
    // Remove this when API is connected.
    this.isFileUploadLoading.set(false);

    this.refetch.emit();
  }

  handleRefetch(): void {
    this.refetch.emit();
  }

  getInitial(): string {
    return (
      this.patientDetails
        ?.firstName
        ?.charAt(0)
        ?.toUpperCase() || '?'
    );
  }
}

