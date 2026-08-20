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
    <div class="d-flex flex-column gap-3" style="max-height: 75vh; overflow-y: auto;">
      @for (tweet of tweets(); track tweet.id) {
        <div class="card shadow-sm border mb-2">
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p class="fs-6 mb-2 text-break">{{ tweet.message }}</p>
              <footer
                class="blockquote-footer mt-1 mb-0 text-muted"
                style="font-size: 0.75rem; color:#474747;"
              >
                Posted by <cite title="Author">&#64;{{ tweet.autor }}</cite>
              </footer>
            </blockquote>
          </div>
        </div>
        <hr />
      } @empty {
        <div class="card shadow-sm border-0 text-center py-5">
          <div class="card-body text-muted">Keine Tweets gefunden.</div>
        </div>
      }
    </div>
  `,
})
export class TweetListComponent {
  public readonly tweets = input.required<Tweet[]>();
}
