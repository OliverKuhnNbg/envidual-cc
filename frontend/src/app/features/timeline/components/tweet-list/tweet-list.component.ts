import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Tweet } from '../../../../core/models/tweet.model';

/*
 * ADR: Contained Viewport Scrolling Architecture
 * Context: The specification demands a scrollable list of tweets, which must not break the overall page layout.
 * Decision: Implement scrolling strictly via CSS (overflow-y: auto) within a bounded container inside a pure presentational "dumb" component.
 * Consequence: Keeps the viewport stable. The component remains entirely decoupled from state logic, receiving data exclusively via Angular inputs.
 */
@Component({
  selector: 'app-tweet-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-group shadow-sm" style="max-height: 65vh; overflow-y: auto;">
      @for (tweet of tweets(); track tweet.id) {
        <div class="list-group-item list-group-item-action py-3">
          <div class="d-flex w-100 justify-content-between align-items-center mb-1">
            <h6 class="mb-0 fw-bold text-primary">&#64;{{ tweet.autor }}</h6>
          </div>
          <p class="mb-1 text-break">{{ tweet.message }}</p>
        </div>
      }
    </div>
  `,
})
export class TweetListComponent {
  public readonly tweets = input.required<Tweet[]>();
}
