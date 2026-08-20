import { Injectable, signal, computed, inject } from '@angular/core';
import { Tweet } from '../models/tweet.model';
import { TweetApiService } from '../../infrastructure/api/tweet-api.service';
import { firstValueFrom } from 'rxjs';

/*
 * ADR: In-Memory Client-Side Filtering via Computed Signals
 * Context: The application requires filtering tweets by keywords (message). We must decide between server-side query endpoints vs. reactive client-side filtering.
 * Decision: Fetch the timeline dataset once and derive the filtered list via an Angular computed() Signal.
 * Consequence: Delivers instant, latency-free search feedback on the client without firing repetitive network requests on every keystroke. This fits the initial 5000 records footprint perfectly.
 */
@Injectable({ providedIn: 'root' })
export class TweetStore {
  private readonly api = inject(TweetApiService);

  // Writable Signals
  private readonly _tweets = signal<Tweet[]>([]);
  private readonly _searchTerm = signal<string>('');

  // Derived State (Read-Only)
  public readonly searchTerm = this._searchTerm.asReadonly();

  public readonly filteredTweets = computed(() => {
    const term = this._searchTerm().trim().toLowerCase();
    const allTweets = this._tweets();

    if (!term) {
      return allTweets;
    }

    // Filter strictly by the 'message' property as requested
    return allTweets.filter((tweet) => tweet.message.toLowerCase().includes(term));
  });

  public setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  public async loadTimeline(): Promise<void> {
    try {
      const data = await firstValueFrom(this.api.getTimeline());
      this._tweets.set(data);
    } catch (error) {
      console.error('Timeline fetch failed', error);
    }
  }
}
