// src/app/core/state/tweet.store.ts

import { Injectable, signal, inject } from '@angular/core';
import { Tweet } from '../models/tweet.model';
import { TweetApiService } from '../../infrastructure/api/tweet-api.service';
import { Subject, switchMap, debounceTime, distinctUntilChanged, tap, catchError, of } from 'rxjs';

/*
 * ADR: Reactive Server-Side Search State Management
 * Context: The previous client-side filtering approach is obsolete since the backend now explicitly handles search queries via JPA.
 * Decision: Transition the store to orchestrate server-side search requests utilizing an RxJS Subject stream with debounce logic, piping the results back into standard Angular Signals.
 * Consequence: We prevent API flooding via debounceTime and handle race conditions via switchMap. The UI components consume the readonly signal synchronously, oblivious to the underlying asynchronous stream orchestration.
 */
@Injectable({ providedIn: 'root' })
export class TweetStore {
  private readonly api = inject(TweetApiService);

  private readonly _tweets = signal<Tweet[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  public readonly tweets = this._tweets.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.initSearchStream();
  }

  private initSearchStream(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this._isLoading.set(true)),
        switchMap((term) =>
          this.api.getTimeline(term).pipe(
            catchError((error) => {
              console.error('Timeline fetch failed', error);
              return of([]);
            }),
          ),
        ),
      )
      .subscribe((data) => {
        this._tweets.set(data);
        this._isLoading.set(false);
      });
  }

  public setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  public loadTimeline(): void {
    this.setSearchTerm('');
  }

  /*
   * ADR: Pessimistic State Mutation and Read-Model Synchronization
   * Context: The store must handle aggregate creation while maintaining consistency with the server's source of truth (e.g., generated UUIDs, audit timestamps).
   * Decision: Implemented a pessimistic mutation flow utilizing a direct subscription for write operations, bypassing the RxJS Subject stream used for reads.
   * Rationale: Unlike search operations which benefit from debounce and cancellation (switchMap), a creation intent is a discrete command that must execute exactly once. Prepending the newly created aggregate directly to the local signal only AFTER a successful server response prevents complex compensating actions (rollbacks) in the UI layer if the HTTP POST fails.
   */
  public addTweet(payload: { content: string; author: string }): void {
    this._isLoading.set(true);

    this.api
      .createTweet(payload)
      .pipe(
        catchError((error) => {
          console.error('Failed to create tweet', error);
          return of(null);
        }),
      )
      .subscribe((newTweet) => {
        this._isLoading.set(false);

        if (newTweet) {
          this._tweets.update((currentTweets) => [newTweet, ...currentTweets]);
        }
      });
  }
}
