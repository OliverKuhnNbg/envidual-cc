import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TweetStore } from '../../core/state/tweet.store';
import { TweetListComponent } from './components/tweet-list/tweet-list.component';

/*
 * ADR: Smart Container Component Pattern
 * Context: Presentational components must be supplied with reactive domain data without coupling them to infrastructure adapters or state stores.
 * Decision: The TimelineComponent acts as a Smart Component, orchestrating the TweetStore and passing reactive signals down to child components.
 * Consequence: Centralizes lifecycle hooks and state injection. If the data fetching strategy changes, only this component and the store are affected, adhering strictly to Domain-Driven Design presentation boundaries.
 */
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TweetListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <h2 class="mb-4 text-center">Timeline</h2>
      <app-tweet-list [tweets]="store.filteredTweets()" />
    </div>
  `,
})
export class TimelineComponent implements OnInit {
  protected readonly store = inject(TweetStore);

  public ngOnInit(): void {
    this.store.loadTimeline();
  }
}
