
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { catchError, throwError } from 'rxjs';
import { GHOService } from '../../services/gho.service';
import { ghoresult, tags } from '../../models/gho-model';
import { FileUploadService } from '../../services/file-upload-service';


@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent implements OnInit, OnChanges {

  srv = inject(GHOService);
  private cdr = inject(ChangeDetectorRef);

  @Input() doctorid: number | string | null = null;
  @Input() doctorname = '';
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  searchText = '';
  selectedChat: any = null;
  newMessage = '';
  messages: any[] = [];
  loading = false;
  chatLoading = false;
  sending = false;
  confirmDeleteMessageId: number | null = null;
  deletingMessageId: number | null = null;
  private fileUploadService = inject(FileUploadService);
  uploadingFile = false;
  selectedFile: File | null = null;
  selectedFilePreview: string | null = null;
  private pendingFileMessageId: number | null = null;
  isRecording = false;
  recordingSeconds = 0;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  private recordingTimer: ReturnType<typeof setInterval> | null = null;
  private mediaStream: MediaStream | null = null;
  private chatRequestId = 0;
  @ViewChild('chatMessages')
  private chatMessages?: ElementRef<HTMLDivElement>;
  ngOnInit(): void {
    this.initializeMessaging();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorid'] && !changes['doctorid'].firstChange) {
      this.initializeMessaging();
    }
    if (
      changes['doctorname'] &&
      this.selectedChat &&
      this.doctorname
    ) {
      this.selectedChat.name = this.doctorname;
      this.cdr.detectChanges();
    }
  }

  initializeMessaging(): void {
    if (this.doctorid) {
      const doctorChat = {
        id: Number(this.doctorid),
        contactType: 'DOCTOR',
        name: this.doctorname || 'Doctor',
        image: '',
        messages: [],
        unread: 0
      };
      this.openChat(doctorChat);
    } else {
      this.chatRequestId++;
      this.selectedChat = null;
      this.newMessage = '';
      this.get();
    }
  }

  get(): void {
    this.loading = true;
    this.tv = [];
    this.tv.push({ T: 'dk1', V: 'PATIENT' });
    this.tv.push({ T: 'c10', V: '29' });
    this.srv.getdata('assist', this.tv)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.cdr.detectChanges();
          return throwError(() => err);
        })
      )
      .subscribe((r) => {
        this.res = r;
        this.loading = false;
        if (r.Status == 1) {
          const data = r.Data?.[0] ?? [];
          this.messages = data.map((item: any) => ({
            id: Number(item.ContactID),
            contactType: 'DOCTOR',
            name: item.ContactName || 'Doctor',
            image: item.ContactImage || '',
            message: item.LastMessage || '',
            time: this.formatTime(item.LastMessageAt),
            lastMessageID: item.LastMessageID,
            lastMessageFromID: item.LastMessageFromID,
            lastMessageBy: item.LastMessageBy,
            isSentByMe: item.IsSentByMe,
            unread: Number(item.UnreadCount ?? 0),
            messages: []
          }));
        } else {
          this.messages = [];
        }
        this.cdr.detectChanges();
      });
  }

  get filteredMessages(): any[] {
    const search = this.searchText.toLowerCase().trim();
    return this.messages.filter(item =>
      item.name?.toLowerCase().includes(search) ||
      item.message?.toLowerCase().includes(search)
    );
  }

  scrollToLatestMessage(): void {
    requestAnimationFrame(() => {
      const container = this.chatMessages?.nativeElement;

      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }

  get unreadCount(): number {
    return this.messages.reduce(
      (total, item) => total + item.unread,
      0
    );
  }

  openChat(message: any): void {
    this.selectedChat = message;
    this.selectedChat.messages = [];
    this.chatLoading = true;
    this.confirmDeleteMessageId = null;
    const requestId = ++this.chatRequestId;
    this.tv = [];
    this.tv.push({ T: 'dk1', V: 'PATIENT' });
    this.tv.push({ T: 'c1', V: 'DOCTOR' });
    this.tv.push({ T: 'c2', V: String(message.id) });
    this.tv.push({ T: 'c10', V: '30' });
    this.srv.getdata('assist', this.tv).subscribe({
      next: (r) => {
        if (
          requestId !== this.chatRequestId ||
          this.selectedChat?.id !== message.id
        ) {
          return;
        }
        this.chatLoading = false;
        if (r.Status == 1) {
          const data = r.Data?.[0] ?? [];
          this.selectedChat.messages = data.map((item: any) => ({
            id: Number(item.MessageID),
            fromID: Number(item.FromID),
            fromType: item.FromType,
            toID: Number(item.ToID),
            toType: item.ToType,
            text: item.Message,
            type: item.Type || 'Text',
            fileURL: item.FileURL || null,
            sender: Number(item.IsSentByMe) === 1 ? 'doctor' : 'patient',
            time: this.formatMessageTime(item.CreatedAt),
            isOpened: item.IsOpened
          }));
          message.unread = 0;
        }
        this.cdr.detectChanges();
        this.scrollToLatestMessage();
      },
      error: () => {
        if (requestId !== this.chatRequestId) {
          return;
        }
        this.chatLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  backToMessages(): void {
    if (this.doctorid) {
      return;
    }
    this.chatRequestId++;
    this.selectedChat = null;
    this.newMessage = '';
    this.confirmDeleteMessageId = null;

  }

  formatTime(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

    }

    return date.toLocaleDateString([], {
      day: '2-digit',
      month: 'short'
    });
  }

  formatMessageTime(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text || !this.selectedChat || this.sending) {
      return;
    }
    this.sending = true;
    this.tv = [];
    this.tv.push({ T: 'dk1', V: 'PATIENT' });
    this.tv.push({ T: 'c1', V: 'DOCTOR' });
    this.tv.push({ T: 'c2', V: String(this.selectedChat.id) });
    this.tv.push({ T: 'c3', V: text });
    this.tv.push({ T: 'c4', V: 'Text' });
    this.tv.push({ T: 'c10', V: '28' });
    this.srv.getdata('assist', this.tv).subscribe({
      next: (r) => {
        this.sending = false;
        if (r.Status == 1) {
          this.newMessage = '';
          const currentChat = this.selectedChat;
          this.openChat(currentChat);
          if (!this.doctorid) {
            this.get();
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.sending = false;
        this.cdr.detectChanges();
      }
    });
  }


  canDeleteMessage(item: any): boolean {
    return String(item.fromType ?? '')
      .trim()
      .toUpperCase() === 'PATIENT';
  }


  requestDeleteMessage(item: any, event: MouseEvent): void {
    event.stopPropagation();
    if (
      !this.canDeleteMessage(item) ||
      this.deletingMessageId !== null
    ) {
      return;
    }
    this.confirmDeleteMessageId = Number(item.id);
  }

  cancelDeleteMessage(event: MouseEvent): void {
    event.stopPropagation();
    this.confirmDeleteMessageId = null;

  }

  // deleteMessage(item: any, event: MouseEvent): void {
  //   event.stopPropagation();
  //   if (
  //     !this.canDeleteMessage(item) ||
  //     this.deletingMessageId !== null ||
  //     this.confirmDeleteMessageId !== Number(item.id)
  //   ) {
  //     return;
  //   }

  //   this.deletingMessageId = Number(item.id);
  //   const currentChat = this.selectedChat;
  //   this.tv = [];
  //   this.tv.push({ T: 'dk1', V: 'PATIENT' });
  //   this.tv.push({ T: 'dk2', V: String(item.id) });
  //   this.tv.push({ T: 'c10', V: '32' });
  //   this.srv.getdata('assist', this.tv).subscribe({
  //     next: (r) => {
  //       this.deletingMessageId = null;
  //       this.confirmDeleteMessageId = null;
  //       if (r.Status == 1) {
  //         this.openChat(currentChat);
  //         if (!this.doctorid) {
  //           this.get();
  //         }
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     error: () => {
  //       this.deletingMessageId = null;
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

  deleteMessage(item: any, event: MouseEvent): void {
    event.stopPropagation();

    if (
      !this.canDeleteMessage(item) ||
      this.deletingMessageId !== null ||
      this.confirmDeleteMessageId !== Number(item.id)
    ) {
      return;
    }

    this.deletingMessageId = Number(item.id);

    this.tv = [];
    this.tv.push({ T: 'dk1', V: 'PATIENT' });
    this.tv.push({ T: 'dk2', V: String(item.id) });
    this.tv.push({ T: 'c10', V: '32' });

    this.srv.getdata('assist', this.tv).subscribe({
      next: (r) => {
        this.deletingMessageId = null;
        this.confirmDeleteMessageId = null;

        if (r.Status == 1) {
          // Remove deleted message immediately from UI
          this.selectedChat.messages =
            this.selectedChat.messages.filter(
              (msg: any) => Number(msg.id) !== Number(item.id)
            );
          if (!this.doctorid) {
            this.get();
          }
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.deletingMessageId = null;
        this.cdr.detectChanges();
      }
    });
  }


  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.selectedFile = input.files[0];
    if (this.selectedFile.type.startsWith('image/')) {
      this.selectedFilePreview = URL.createObjectURL(this.selectedFile);
    } else {
      this.selectedFilePreview = null;
    }
    this.cdr.detectChanges();
  }


  removeSelectedFile(): void {
    if (this.selectedFilePreview) {
      URL.revokeObjectURL(this.selectedFilePreview);
    }
    this.selectedFile = null;
    this.selectedFilePreview = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }


  uploadFile(messageType: 'File' | 'Audio' = 'File'): void {
    if (
      !this.selectedFile ||
      !this.selectedChat ||
      this.sending
    ) {
      return;
    }
    const file = this.selectedFile;
    this.sending = true;
    if (this.pendingFileMessageId) {
      void this.uploadSelectedFile(this.pendingFileMessageId, file);
      return;
    }
    this.tv = [];
    this.tv.push({ T: 'dk1', V: 'PATIENT' });
    this.tv.push({ T: 'c1', V: 'DOCTOR' });
    this.tv.push({ T: 'c2', V: String(this.selectedChat.id) });
    this.tv.push({ T: 'c3', V: '' });
    this.tv.push({ T: 'c4', V: messageType });
    this.tv.push({ T: 'c10', V: '28' });
    this.srv.getdata('assist', this.tv).subscribe({
      next: async (r) => {
        if (r.Status == 1) {
          const messageID = Number(r.Data?.[0]?.[0]?.MessageID);
          if (!messageID) {
            this.sending = false;
            console.error('MessageID was not returned.');
            return;
          }
          this.pendingFileMessageId = messageID;
          await this.uploadSelectedFile(messageID, file);
        } else {
          this.sending = false;
          console.warn(r.Info || 'Failed to create file message.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.sending = false;
        console.error('Failed to create file message:', err);
        this.cdr.detectChanges();
      }
    });
  }

  private async uploadSelectedFile(
    messageID: number,
    file: File
  ): Promise<void> {
    this.uploadingFile = true;
    try {
      const success = await this.fileUploadService.handleFileUpload(
        '',
        String(messageID),
        file,
        '61'
      );
      if (success) {
        this.pendingFileMessageId = null;
        this.removeSelectedFile();
        this.newMessage = '';
        const currentChat = this.selectedChat;
        this.openChat(currentChat);
        if (!this.doctorid) {
          this.get();
        }
      } else {
        console.warn('File upload failed. Please try again.');
      }

    } catch (err: any) {
      console.error('File upload failed:', err);
    } finally {
      this.uploadingFile = false;
      this.sending = false;
      this.cdr.detectChanges();
    }
  }

  isImageFile(url: string): boolean {
    if (!url) return false;
    const extension = url
      .split('?')[0]
      .split('.')
      .pop()
      ?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  }

  async startRecording(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4'
      ].find(type => MediaRecorder.isTypeSupported(type));
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(
        this.mediaStream,
        mimeType ? { mimeType } : undefined
      );

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, {
          type: this.mediaRecorder?.mimeType || 'audio/webm'
        });
        this.mediaStream?.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
        if (!blob.size) {
          console.error('Empty audio recording');
          return;
        }
        if (this.selectedFilePreview) {
          URL.revokeObjectURL(this.selectedFilePreview);
        }
        this.selectedFilePreview = URL.createObjectURL(blob);
        const extension = blob.type.includes('mp4') ? 'm4a' : 'webm';
        this.selectedFile = new File(
          [blob],
          `voice-message-${Date.now()}.${extension}`,
          { type: blob.type }
        );
        this.cdr.detectChanges();
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('Recording error:', event);
      };
      this.mediaRecorder.start(1000);
      this.isRecording = true;
      this.recordingSeconds = 0;
      this.recordingTimer = setInterval(() => {
        this.recordingSeconds++;
        this.cdr.detectChanges();
      }, 1000);

    } catch (error) {
      console.error('Recording error:', error);
      this.mediaStream?.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
      this.isRecording = false;
      this.cdr.detectChanges();
    }
  }


  stopRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
  }


  formatRecordingTime(): string {
    const minutes = Math.floor(this.recordingSeconds / 60);
    const seconds = this.recordingSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

}
