import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Tweet } from '../../../../core/models/tweet.model';

/*
 * ADR: Contained Viewport Scrolling Architecture
 * Context: The application requires a scrollable list of tweets that does not disrupt the global document flow or trigger window-level scrolling.
 * Decision: Implement isolated scrolling via CSS (overflow-y: auto) within a bounded container inside a pure presentational "dumb" component.
 * Consequence: Maintains a stable viewport. The component remains entirely decoupled from state logic, receiving data exclusively via Angular Signal inputs, ensuring high reusability and isolated change detection boundaries.
 */
@Component({
  selector: 'app-tweet-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-group shadow-sm" style="max-height: 75vh; overflow-y: auto;">
      @for (tweet of tweets(); track tweet.id) {
        <div class="list-group-item list-group-item-action py-3">
          <div class="d-flex w-100 justify-content-between align-items-center mb-1">
            <h6 class="mb-0 fw-bold text-primary">&#64;{{ tweet.autor }}</h6>
          </div>
          <p class="mb-1 text-break">{{ tweet.message }}</p>
        </div>
      } @empty {
        <div class="text-center text-muted py-4">Keine Tweets gefunden.</div>
      }
    </div>
  `,
})
export class TweetListComponent {
  public readonly tweets = input.required<Tweet[]>();
}
