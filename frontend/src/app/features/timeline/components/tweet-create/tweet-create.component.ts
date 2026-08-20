import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TweetStore } from '../../../../core/state/tweet.store';

@Component({
  selector: 'app-tweet-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tweet-create-container">
      <textarea
        [(ngModel)]="content"
        placeholder="What is happening?!"
        rows="3"
        class="tweet-input"
      >
      </textarea>

      <div class="actions">
        <input type="text" [(ngModel)]="author" placeholder="Your Name" class="author-input" />
        <button (click)="onSubmit()" [disabled]="isSubmitDisabled()">Post Tweet</button>
      </div>
    </div>
  `,
  styles: [
    `
      /* ... (bestehende Styles aus vorheriger Antwort) ... */
      .tweet-create-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
        border: 1px solid #e1e8ed;
        border-radius: 8px;
        margin-bottom: 2rem;
      }
      .tweet-input {
        resize: vertical;
        width: 100%;
        padding: 0.75rem;
        border-radius: 4px;
        border: 1px solid #ccd6dd;
        font-family: inherit;
      }
      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .author-input {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ccd6dd;
      }
      button {
        padding: 0.5rem 1.5rem;
        background-color: #1da1f2;
        color: white;
        font-weight: bold;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TweetCreateComponent {
  readonly tweetStore = inject(TweetStore);

  content = signal('');
  author = signal('');

  isSubmitDisabled(): boolean {
    return this.content().trim().length === 0 || this.tweetStore.isLoading();
  }

  onSubmit(): void {
    if (this.isSubmitDisabled()) {
      return;
    }

    const payload = {
      content: this.content().trim(),
      author: this.author().trim() || 'Anonymous',
    };

    console.log('[TweetCreateComponent] Dispatching intent to create tweet:', payload);

    this.tweetStore.addTweet(payload);

    this.content.set('');
  }
}
