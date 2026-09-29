import {
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-file-upload-popover',
  standalone: true,
  templateUrl: './file-upload-popover.html',
})
export class FileUploadPopover {
  @Output() fileSubmit = new EventEmitter<File>();

  file = signal<File | null>(null);
  open = signal(false);
  showNoFileMessage = signal(false);

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    const selectedFile = input.files?.[0] ?? null;


    this.file.set(selectedFile);
    this.showNoFileMessage.set(false);
  }

  handleSubmit(): void {
    const selectedFile = this.file();
    if (!selectedFile) {
      this.showNoFileMessage.set(true);
      return;
    }
    this.fileSubmit.emit(selectedFile);

    this.open.set(false);
    this.file.set(null);
  }

  togglePopover(): void {
    this.open.update((value) => !value);
    this.showNoFileMessage.set(false);
  }

  closePopover(): void {
    this.open.set(false);
  }

  getFileSize(file: File): string {
    return (file.size / 1024).toFixed(1);
  }
}