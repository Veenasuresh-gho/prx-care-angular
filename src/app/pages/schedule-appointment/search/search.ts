import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../components/button/button';

@Component({
  selector: 'app-search',
  imports: [FormsModule, MatIconModule,Button],
  templateUrl: './search.html',
})
export class Search {
  @Input() placeholder = 'Search by doctor or speciality';

  @Output() searchChange = new EventEmitter<string>();

  searchTerm = '';

  handleSearch(): void {
    this.searchChange.emit(this.searchTerm.trim());
  }

  handleClear(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }
}