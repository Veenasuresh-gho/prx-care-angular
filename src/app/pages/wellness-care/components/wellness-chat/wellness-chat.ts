import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../../../services/ai-service';

interface WellnessMessage {
    id: number;
    type: 'bot' | 'user';
    text: string;
    time: Date;
}

@Component({
    selector: 'app-wellness-chat',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule
    ],
    templateUrl: './wellness-chat.html'
})
export class WellnessChat implements AfterViewChecked {

    @ViewChild('chatContainer')
    chatContainer!: ElementRef<HTMLDivElement>;

    messages: WellnessMessage[] = [
        {
            id: 1,
            type: 'bot',
            text: "Hi👋, I'm your wellness assistant. How are you feeling today?",
            time: new Date()
        }
    ];

    inputValue = '';
    isTyping = false;
    shouldScroll = false;

    quickReplies = [
        '💤 How can I improve my sleep?',
        '😌 Tips to reduce daily stress',
        '💧 How much water should I drink daily?'
    ];

    constructor(
        private aiService: AiService,
        private cdr: ChangeDetectorRef
    ) { }

    ngAfterViewChecked(): void {
        if (this.shouldScroll) {
            this.scrollToBottom();
            this.shouldScroll = false;
        }
    }

    private scrollToBottom(): void {
        if (this.chatContainer?.nativeElement) {
            const container = this.chatContainer.nativeElement;
            container.scrollTop = container.scrollHeight;
        }
    }

    sendMessage(): void {
        const text = this.inputValue.trim();

        if (!text || this.isTyping) {
            return;
        }

        this.messages.push({
            id: this.messages.length + 1,
            type: 'user',
            text,
            time: new Date()
        });

        this.inputValue = '';
        this.isTyping = true;
        this.shouldScroll = true;
        this.cdr.detectChanges();
        this.aiService
            .aiAssistantChat('wellness-chat', text)
            .subscribe({
                next: (response: any) => {
                    const aiText = response?.data
                        ? this.cleanMessage(response.data)
                        : 'I could not process your request.';
                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: aiText,
                        time: new Date()
                    });

                    this.isTyping = false;
                    this.shouldScroll = true;
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 0);
                },
                error: (error) => {
                    console.error('WELLNESS AI API ERROR:', error);
                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: '⚠️ Something went wrong. Please try again.',
                        time: new Date()
                    });
                    this.isTyping = false;
                    this.shouldScroll = true;
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 0);
                }
            });
    }

    private cleanMessage(text: string): string {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/^\s*[-*]\s+/gm, '• ');
    }

    selectQuickReply(reply: string): void {
        this.inputValue = reply;
        this.cdr.detectChanges();
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}

