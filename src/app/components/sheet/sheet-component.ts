import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sheet',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sheet-component.html',
    styleUrl: './sheet-component.css'
})
export class SheetComponent {

    @Input() open = false;

    @Input() side: 'right' | 'left' | 'top' | 'bottom' = 'right';

    @Input() width = '500px';

    @Input() title = '';

    @Input() description = '';

    @Input() showClose = true;

    @Output() openChange = new EventEmitter<boolean>();

    close(): void {
        this.open = false;
        this.openChange.emit(false);
    }

    get sheetClasses(): string {
        return `
    fixed z-50
    bg-white
    text-gray-900
    shadow-xl
    flex flex-col
    overflow-hidden
    transition-transform duration-300 ease-in-out
  `;
    }
}