// src/app/features/timeline/components/tweet-search/tweet-search.component.ts

import { Component, ChangeDetectionStrategy, output } from '@angular/core';

/*
 * ADR: Stateless Presentational Search Component
 * Context: We need to capture user search input without coupling the UI to the data fetching logic.
 * Decision: Create a dumb component utilizing Angular's output() function to emit search terms.
 * Consequence: The component remains purely presentational, reusable, and easily testable. It delegates the responsibility of handling the search intent (e.g., API calls, debouncing) to the smart container or application store.
 */
@Component({
  selector: 'app-tweet-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-4">
      <input
        type="text"
        class="form-control shadow-sm"
        placeholder="Filter keywords in messages..."
        (input)="onInput($event)"
      />
    </div>
  `,
})
export class TweetSearchComponent {
  public readonly search = output<string>();

  public onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
