import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*
 * ADR: Temporary Infrastructure Boundary Validation
 * Context: We need to prove that the Vite proxy and the Spring Boot backend communicate correctly before implementing the Domain-Driven Design stores.
 * Decision: Bypass the Clean Architecture layers temporarily. Inject the HttpClient directly into the dumb App Shell and log the payload to the browser console.
 * Consequence: This acts as an immediate fail-fast mechanism for the network layer. Once the 200 OK is verified, this must be refactored into a dedicated Infrastructure API Adapter.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 2rem; font-family: sans-serif;">
      <h2>System Diagnostics</h2>
      <p>Bitte öffne die Entwicklertools (F12) und prüfe den "Console" Tab.</p>
    </div>
  `,
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  public ngOnInit(): void {
    console.log('Initiating REST call to /api/tweets...');

    this.http.get('/api/tweets').subscribe({
      next: (response) => console.log('✅ BACKEND DATA RECEIVED:', response),
      error: (err) => console.error('❌ NETWORK OR PROXY ERROR:', err),
    });
  }
}
