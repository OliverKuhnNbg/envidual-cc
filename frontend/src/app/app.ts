import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TimelineComponent } from './features/timeline/timeline.component';

/*
 * ADR: Root App Shell Migration
 * Context: The diagnostic network check successfully proved that the Vite proxy and backend are fully operational.
 * Decision: Replace the temporary diagnostic logging shell with the production-ready TimelineComponent.
 * Consequence: Elevates the feature-level timeline component to the application root shell, connecting the UI layout directly to the reactive Signal Store and Infrastructure API adapters.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-vh-100 bg-light py-3">
      <app-timeline />
    </main>
  `,
})
export class App {}
