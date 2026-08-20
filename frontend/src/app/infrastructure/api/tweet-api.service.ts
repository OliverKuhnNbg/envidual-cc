import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tweet } from '../../core/models/tweet.model';

/*
 * ADR: Infrastructure API Adapter Pattern
 * Context: The application needs to fetch the timeline without coupling the UI or state management to HTTP semantics.
 * Decision: Isolate all REST API interactions within a dedicated adapter service.
 * Consequence: The domain store remains ignorant of endpoints and protocols. If the backend API changes, only this adapter requires modification, ensuring high maintainability.
 */
@Injectable({ providedIn: 'root' })
export class TweetApiService {
  private readonly http = inject(HttpClient);

  public getTimeline(): Observable<Tweet[]> {
    return this.http.get<Tweet[]>('/api/tweets');
  }
}
