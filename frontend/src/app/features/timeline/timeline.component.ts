// src/app/features/timeline/timeline.component.ts

import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TweetStore } from '../../core/state/tweet.store';
import { TweetListComponent } from './components/tweet-list/tweet-list.component';
import { TweetSearchComponent } from './components/tweet-search/tweet-search.component';

/*
 * ADR: Smart Container with Delegated Search Actions
 * Context: The introduction of a dedicated search input component requires integration with the application state.
 * Decision: The TimelineComponent acts as the integration point, connecting the output of the presentational search component to the reactive store's action dispatcher.
 * Consequence: Preserves a strict unidirectional data flow. The components remain decoupled from the HTTP infrastructure, relying purely on Signals for reading state and store methods for dispatching actions.
 */
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TweetListComponent, TweetSearchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <div class="container"><app-tweet-search (search)="onSearch($event)" /></div>
      <div>
        <div class="container">
          <h2 class="mb-4 text-center">Timeline</h2>

          @if (store.isLoading()) {
            <div class="text-center text-muted my-3">
              <div class="spinner-border spinner-border-sm" role="status"></div>
              <span class="ms-2">Lade Tweets...</span>
            </div>
          }

          <app-tweet-list [tweets]="store.tweets()" />
        </div>
      </div>
    </div>
  `,
})
export class TimelineComponent implements OnInit {
  protected readonly store = inject(TweetStore);

  public ngOnInit(): void {
    this.store.loadTimeline();
  }

  public onSearch(term: string): void {
    this.store.setSearchTerm(term);
  }
}
