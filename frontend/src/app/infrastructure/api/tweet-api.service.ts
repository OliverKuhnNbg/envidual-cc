// src/app/infrastructure/api/tweet-api.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tweet } from '../../core/models/tweet.model';

/*
 * ADR: Infrastructure API Adapter for Server-Side Search
 * Context: The application needs to request the timeline with an optional search query against the updated REST endpoint.
 * Decision: Encapsulate the HTTP parameter construction within the API service adapter.
 * Consequence: The domain store remains completely agnostic of HTTP request structures (like HttpParams), maintaining a clean boundary between the application state and external API contracts.
 */
@Injectable({ providedIn: 'root' })
export class TweetApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/tweets';

  public getTimeline(searchKeyword?: string): Observable<Tweet[]> {
    let params = new HttpParams();

    if (searchKeyword && searchKeyword.trim() !== '') {
      params = params.set('search', searchKeyword.trim());
    }

    return this.http.get<Tweet[]>(this.apiUrl, { params });
  }
}
