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
}
