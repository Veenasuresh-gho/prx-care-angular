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

interface NutriMessage {
    id: number;
    type: 'bot' | 'user';
    text: string;
    time: Date;
}

@Component({
    selector: 'app-nutrition-chat',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule
    ],
    templateUrl: './nutrition-chat.html'
})
export class NutritionChat implements AfterViewChecked {

    @ViewChild('chatContainer')
    chatContainer!: ElementRef<HTMLDivElement>;
    messages: NutriMessage[] = [
        {
            id: 1,
            type: 'bot',
            text: "Hi👋 I'm your nutrition assistant. Ask me about diet plans, healthy foods, calories, or weight goals! 🍎",
            time: new Date()
        }
    ];

    inputValue = '';
    isTyping = false;
    shouldScroll = false;
    hasSentAnalyzedResult = false;

    quickReplies = [
        '🍎 Suggest healthy snack options',
        '🥩 High-protein meal ideas',
        '⚖️ How to reduce belly fat?'
    ];

    constructor(
        private aiService: AiService,
        private cdr: ChangeDetectorRef
    ) {
        this.sendAnalyzedResult();
    }

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

    private sendAnalyzedResult(): void {
        const analyzedResult = sessionStorage.getItem(
            'nutritionAnalyzedResult'
        );
        if (!analyzedResult || this.hasSentAnalyzedResult) {
            return;
        }
        this.hasSentAnalyzedResult = true;
        this.isTyping = true;
        this.shouldScroll = true;
        this.cdr.detectChanges();
        this.aiService
            .aiAssistantChat('nutrition-chat', analyzedResult)
            .subscribe({
                next: (response: any) => {
                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: this.cleanMessage(
                            response?.data || 'No response received.'
                        ),
                        time: new Date()
                    });
                    this.isTyping = false;
                    this.shouldScroll = true;
                    sessionStorage.removeItem(
                        'nutritionAnalyzedResult'
                    );
                    this.cdr.detectChanges();
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 0);
                },
                error: (error) => {
                    console.error(
                        'NUTRITION AI API ERROR:',
                        error
                    );
                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: '⚠️ Something went wrong.',
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
            .aiAssistantChat('nutrition-chat', text)
            .subscribe({
                next: (response: any) => {
                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: this.cleanMessage(
                            response?.data ||
                            'No response received.'
                        ),
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
                    console.error(
                        'NUTRITION AI API ERROR:',
                        error
                    );

                    this.messages.push({
                        id: this.messages.length + 1,
                        type: 'bot',
                        text: '⚠️ Something went wrong.',
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
