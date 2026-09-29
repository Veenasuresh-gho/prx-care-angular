import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';

import { FileUploadPopover } from '../file-upload-popover/file-upload-popover';
import { FileUploadService } from '../../../services/file-upload-service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [FileUploadPopover],
  templateUrl: './profile-card.html',
})
export class ProfileCard implements OnChanges {
  private fileUploadService = inject(FileUploadService);

  @Input() patientDetails: any = null;
  @Input() loading = false;

  @Output() refetch = new EventEmitter<void>();

  avatarPreview = signal<string | undefined>(undefined);
  isFileUploadLoading = signal(false);

  skeletonItems = [1, 2, 3, 4, 5, 6];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientDetails']) {
      this.avatarPreview.set(
        this.patientDetails?.imageUrl || undefined
      );
    }
  }

  get userId(): string | null {
    return sessionStorage.getItem('id');
  }

  get genderAge(): string {
    return [
      this.patientDetails?.Gender,
      this.patientDetails?.Age,
    ]
      .filter(Boolean)
      .join(', ');
  }

  get details() {
    const p = this.patientDetails;

    return [
      {
        icon: 'cake',
        label: 'Date of birth',
        value: p?.BirthDate || '',
      },
      {
        icon: 'phone',
        label: 'Mobile number',
        value: `${p?.CountryCode ?? ''} ${p?.Phone ?? ''}`.trim(),
      },
      {
        icon: 'email',
        label: 'Email',
        value: p?.Email || '',
      },
      {
        icon: 'bloodtype',
        label: 'Blood group',
        value: p?.BloodGroup || '',
      },
      {
        icon: 'favorite',
        label: 'Marital status',
        value: p?.MaritalStatus || '',
      },
      {
        icon: 'work',
        label: 'Occupation',
        value: p?.Occupation || '',
      },
    ];
  }

  async handleFileSubmit(file: File): Promise<void> {
    if (!file) {
      console.error('No file received');
      return;
    }

    if (!file.type.startsWith('image/')) {
      console.error('Only image files are allowed');
      return;
    }

    const userId = this.userId;


    if (!userId) {
      console.error(
        'User ID is missing from sessionStorage["id"]'
      );
      return;
    }
    const previousPreview = this.avatarPreview();
    if (previousPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(previousPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    this.avatarPreview.set(previewUrl);
    this.isFileUploadLoading.set(true);
    try {
      const success =
        await this.fileUploadService.handleFileUpload(
          "",
          userId,
          file,
          '1'
        );
      if (success) {
        this.refetch.emit();
      } else {
        console.error('File upload failed');
        this.avatarPreview.set(
          this.patientDetails?.imageUrl || undefined
        );
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      this.avatarPreview.set(
        this.patientDetails?.imageUrl || undefined
      );
    } finally {
      this.isFileUploadLoading.set(false);
    }
  }

  getInitial(): string {
    return (
      this.patientDetails?.FirstName
        ?.charAt(0)
        ?.toUpperCase() || '?'
    );
  }
}