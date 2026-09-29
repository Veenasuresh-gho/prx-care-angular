import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

interface AccountOption {
  id: string;
  name: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-switch-user-popover',
  standalone: true,
  templateUrl: './switch-user-popover.html',
})
export class SwitchUserPopover {
  @Input() accounts: AccountOption[] = [];
  @Input() userId: string | null = null;
  @Input() owner: string | null = null;

  @Output() accountSelected = new EventEmitter<AccountOption>();
  @Output() refetch = new EventEmitter<void>();

  isOpen = signal(false);
  selected = signal<string>('');
  detachingId = signal<string | null>(null);

  get otherAccounts(): AccountOption[] {
    return this.accounts.filter((account) => account.id !== this.userId);
  }

  togglePopover(): void {
    this.isOpen.update((value) => !value);

    if (this.isOpen()) {
      this.setInitialSelection();
    }
  }

  closePopover(): void {
    this.isOpen.set(false);
  }

  setInitialSelection(): void {
    if (!this.accounts.length) {
      this.selected.set('');
      return;
    }

    const match = this.accounts.find(
      (account) => account.id === this.userId
    );

    this.selected.set(match?.id ?? this.accounts[0].id);
  }

  handleSelect(account: AccountOption): void {
    this.selected.set(account.id);
    this.accountSelected.emit(account);
  }

  handleDetach(accountId: string): void {
    this.detachingId.set(accountId);
    console.log('Detach member:', accountId);

    this.detachingId.set(null);
    this.refetch.emit();
  }

  getInitial(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }
}

