import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-start-chat-with-bot',
    standalone: true,
    templateUrl: './start-chat-with-bot.html'
})
export class StartChatWithBot {

    @Output() startChat = new EventEmitter<void>();
    openChat(): void {
        this.startChat.emit();
    }
}