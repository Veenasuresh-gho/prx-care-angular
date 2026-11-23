
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
    OverlayModule,
    Overlay,
    OverlayRef,
    ConnectedPosition
} from '@angular/cdk/overlay';

import { TemplatePortal } from '@angular/cdk/portal';


import { Subject, EMPTY, timer } from 'rxjs';
import {
    catchError,
    exhaustMap,
    filter,
    takeUntil,
    tap
} from 'rxjs/operators';
import { MessageComponent } from '../message';
import { GHOService } from '../../../services/gho.service';
import { ghoresult, tags } from '../../../models/gho-model';

@Component({
    selector: 'app-message-center',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        OverlayModule,
        MessageComponent
    ],
    templateUrl: './message-center.html',
    styleUrl: './message-center.css'
})
export class MessageCenterComponent implements OnInit, OnDestroy {

    @ViewChild('chatSheetTemplate')
    chatSheetTemplate!: TemplateRef<any>;
    srv = inject(GHOService);
    private cdr = inject(ChangeDetectorRef);
    isMessageDropdown = false;
    selectedMessage: any = null;
    unreadCount = 0;
    messages: any[] = [];
    loading = false;
    tv: tags[] = [];
    res: ghoresult = new ghoresult();
    private chatOverlayRef: OverlayRef | null = null;
    private destroy$ = new Subject<void>();
    private readonly pollingInterval = 30000;

    messagePositions: ConnectedPosition[] = [
        {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetY: 8
        },
        {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetY: -8
        }
    ];

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef
    ) { }

    //   ngOnInit(): void {

    //     timer(0, this.pollingInterval).pipe(
    //       filter(() => document.visibilityState === 'visible'),
    //       exhaustMap(() => this.fetchNotifications()),
    //       takeUntil(this.destroy$)
    //     ).subscribe();

    //   }
    ngOnInit(): void {
        this.fetchNotifications()
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private fetchNotifications() {

        this.tv = [];
        this.tv.push({ T: 'c10', V: '31' });
        this.tv.push({ T: 'dk1', V: 'Patient' });
        return this.srv.getdata('assist', this.tv).pipe(
            tap((r) => {
                this.res = r;
                if (r.Status == 1) {
                    const countData = r.Data?.[0] ?? [];
                    const notificationData = r.Data?.[1] ?? [];
                    this.unreadCount = Number(
                        countData?.[0]?.UnreadCount ?? 0
                    );

                    this.messages = notificationData.map((item: any) => ({
                        id: `${item.ContactType}_${item.ContactID}`,
                        contactID: Number(item.ContactID),
                        contactType: item.ContactType,
                        name: item.ContactName || 'Unknown',
                        image: item.ContactImage || '',
                        message: item.Message || '',
                        time: this.formatTime(item.CreatedAt),
                        createdAt: item.CreatedAt,
                        messageID: item.MessageID,
                        unread: Number(item.UnreadCount ?? 0)
                    }));

                }
                this.cdr.detectChanges();
            }),

            catchError((err) => {
                console.error('Notification refresh failed:', err);
                return EMPTY;
            })
        );

    }

    toggleMessages(): void {
        this.isMessageDropdown = !this.isMessageDropdown;
    }

    closeMessageDropdown(): void {
        this.isMessageDropdown = false;
    }

    openChat(message?: any): void {
        this.selectedMessage = message || null;
        this.isMessageDropdown = false;
        this.openChatOverlay();
    }

    openChatOverlay(): void {
        if (this.chatOverlayRef?.hasAttached()) {
            this.chatOverlayRef.detach();
        }
        if (!this.chatOverlayRef) {
            this.chatOverlayRef = this.overlay.create({
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-transparent-backdrop',
                panelClass: 'patient-chat-overlay-pane',
                width: '550px',
                maxWidth: '100vw',
                height: 'calc(100vh - 64px)',
                positionStrategy: this.overlay.position()
                    .global()
                    .top('64px')
                    .right('0'),
                scrollStrategy: this.overlay.scrollStrategies.block()
            });

            this.chatOverlayRef.backdropClick().subscribe(() => {
                this.closeChat();
            });

        }

        const portal = new TemplatePortal(
            this.chatSheetTemplate,
            this.viewContainerRef
        );

        this.chatOverlayRef.attach(portal);

    }

    closeChat(): void {
        this.chatOverlayRef?.detach();
        this.selectedMessage = null;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.chatOverlayRef?.dispose();
    }

}
