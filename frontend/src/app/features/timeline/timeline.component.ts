import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TweetStore } from '../../core/state/tweet.store';
import { TweetListComponent } from './components/tweet-list/tweet-list.component';

/*
 * ADR: Reactive View Binding via Computed Signals
 * Context: The store encapsulates the raw entity array and exposes a computed signal (filteredTweets) to handle both the default timeline and future search queries.
 * Decision: Bind the dumb TweetListComponent strictly to the computed filteredTweets signal.
 * Consequence: Ensures the view inherently reacts to both initial data loads and subsequent filtering without requiring distinct data streams or manual component-level state synchronization.
 */
@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [TweetListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container py-4" style="max-width: 680px;">
      <h2 class="mb-4 text-center">Timeline</h2>

      <!-- Der Viewport bindet sich nun an das abgeleitete Signal -->
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
